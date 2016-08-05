var React = require('react');
var ReactDOM = require('react-dom')
var Sound = require('react-sound');
var runMesh = require('../utility/mesh')
var bufferToWav = require('audiobuffer-to-wav');
var Slider = require('react-slider');

var AudioComponent = React.createClass({
  getInitialState: function(){
    return {
      meshRendering: false,
      meshFinished: false,
      songUrlObject: {},
      playing: false,
      sliderVal: 0,
      howAddy: 'Not Very Addy'
    }
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
  makeWav: function(buffer){

    var wav = bufferToWav(buffer);
    var blob = new window.Blob([ new DataView(wav) ], {
      type: 'audio/wav'
    })
    var url = window.URL.createObjectURL(blob)

    this.setState({songUrlObject: url})
    this.setState({meshFinished: true, meshRendering: false})
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
        <progress ref="seekbar" value="0" max="1" style={{display: 'block', width:300}}></progress>
        <i onClick={this.playPauseAudio} className={this.state.playing ? "fa fa-pause-circle fa-3x" : "fa fa-play-circle fa-3x"} aria-hidden="true"></i>
      </div>
      {this.props.adSource ? <div><p>{this.state.howAddy}</p><Slider className="meshSlider" min={50} max={85} onChange={this.handleSlider} sliderVal={this.state.sliderVal} orientation='horizontal' /></div> : null}
      {this.props.adSource ? <button className="btn waves-effect waves-light" onClick={this.letsMesh}>Mesh</button> : null}
      {this.state.meshRendering ? <img src="/images/loader.gif"/> : null}
      {this.state.meshFinished ? <audio className="audioPlayer" src={this.state.songUrlObject} controls /> : null}
      </div>
    </div>
  }
})

module.exports = AudioComponent
