var React = require('react');
var ReactDOM = require('react-dom')
var Sound = require('react-sound');
var runMesh = require('../utility/mesh')
var bufferToWav = require('audiobuffer-to-wav');
var Slider = require('react-slider');
var FirebaseApp = require('./FirebaseApp');
var FirebaseDBRef;


var AudioComponent = React.createClass({
  getInitialState: function(){
    return {
      meshRendering: false,
      meshFinished: false,
      meshFileLocation: '',
      meshSongTitle: '',
      songUrlObject: {},
      playing: false,
      sliderVal: 0,
      howAddy: 'Not Very Addy'
    }
  },
  componentWillMount: function(){
    this.setState({user: FirebaseApp.auth().currentUser})
    FirebaseDBRef = FirebaseApp.database();
  },
  componentDidMount: function(){
    this.refs.audioTag.addEventListener('timeupdate', this.handleTimeUpdate)
  },
  handleTimeUpdate: function(){
    let currentTime = this.refs.audioTag.currentTime;
    let trackDuration = this.refs.audioTag.duration;
    $(ReactDOM.findDOMNode(this.refs.seekbar)).attr("value", currentTime / trackDuration);
  },
  letsMesh: function(){
    //value will be int from slider - make into float;
    let decimalVal = this.state.sliderVal/100;
    this.setState({meshRendering: true})
    runMesh(this.props.songUploaded, this.props.adSource, decimalVal, buffer => {
          console.log('got buffer', buffer);
      this.makeWav(buffer)
    })
  },
  getSongName: function(str){
    return str.slice(7, str.length - 4)
  },
  makeWav: function(buffer){
    let wav = bufferToWav(buffer);
    let blob = new window.Blob([ new DataView(wav) ], {
      type: 'audio/wav'
    })
    this.setState({meshSongTitle: this.getSongName(this.props.songUploaded) + ' 😊'})
    let file = new File([blob], this.state.meshSongTitle);
    this.uploadToServer(file)
    let url = window.URL.createObjectURL(blob)

    this.setState({songUrlObject: url})
    this.setState({meshFinished: true, meshRendering: false})
    this.props.songMeshSuccessNotification()
  },
  uploadToServer: function(file){
    let self = this;
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload/meshed', true);
    console.log(file);
    let form = new FormData()
    form.append('name', file.name)
    form.append('song', file)
    xhr.send(form)
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
        self.setState({meshFileLocation: xhr.responseText})
        self.addSongToProfile(self.state.meshFileLocation)
        console.log(xhr.responseText);
      }
    }
  },
  addSongToProfile: function(location){
    FirebaseDBRef.ref('users/' + FirebaseApp.auth().currentUser.uid + '/songs').push({
      fileLocation: this.state.meshFileLocation,
      fileTitle: this.state.meshSongTitle,
      ad: this.props.adSource.slice(5, this.props.adSource.length -4),
      meshed: true,
      adProvider: this.props.adProvider,
      adKey: this.props.adKey,
      cpmBid: this.props.cpmBid
    })
    .then(doc => {
      return FirebaseDBRef.ref('users/' + this.props.adProvider + '/ads/' + this.props.adKey + '/meshes').push({
        artist: FirebaseApp.auth().currentUser.uid,
        fileLocation: this.state.meshFileLocation,
        fileTitle: this.state.meshSongTitle,
        meshed: true,
        songKey: doc.key

      })
    })
    .then(doc => console.log(doc))
    .catch(err => console.log(err))
  },
  playPauseAudio: function(){
    this.state.playing ? this.refs.audioTag.pause() : this.refs.audioTag.play();
    this.setState({playing: !this.state.playing})
  },
  handleSlider: function(sliderVal){
    this.setState({sliderVal: sliderVal})
    if(this.state.sliderVal < 60) this.setState({howAddy: 'Not Very Addy'})
    else if(this.state.sliderVal < 70) this.setState({howAddy: 'Kinda Addy'})
    else if(this.state.sliderVal < 80) this.setState({howAddy: 'Addy'})
    else if(this.state.sliderVal < 90) this.setState({howAddy: 'LMAO IM GETTIN PAID'})
  },
  render: function(){
    return <div className="row">
    <div className="col s4">
      <audio ref="audioTag" className="audioPlayer" src={this.props.source}/>
      <div className=" audioControls">
        <i onClick={this.playPauseAudio} className={this.state.playing ? "fa fa-pause-circle fa-3x" : "fa fa-play-circle fa-3x"} aria-hidden="true"></i>
        <progress ref="seekbar" value="0" max="1" style={{display: 'block', width:300}}></progress>
      </div>
      {this.props.adSource && this.props.songUploaded ? <div><p>{this.state.howAddy}</p><Slider className="meshSlider" min={50} max={85} onChange={this.handleSlider} sliderVal={this.state.sliderVal} orientation='horizontal' /></div> : null}
      {this.props.adSource && this.props.songUploaded ? <button className="btn waves-effect waves-light" onClick={this.letsMesh}>Mesh</button> : null}
      {this.state.meshRendering ? <img src="/images/loader.gif"/> : null}
      </div>
    </div>
  }
})

module.exports = AudioComponent
