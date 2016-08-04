var React = require('react');
var ReactDOM = require('react-dom')
var Sound = require('react-sound');
var runMesh = require('../utility/mesh')
var bufferToWav = require('audiobuffer-to-wav');


var AudioComponent = React.createClass({
  getInitialState: function(){
    return {
      meshRendering: false,
      meshFinished: false,
      songUrlObject: {}
    }
  },
  letsMesh: function(){
    this.setState({meshRendering: true})
    runMesh(this.props.songUploaded, this.props.adSource, buffer => {
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
    this.setState({meshFinished: true})
  },
  render: function(){
    return <div>
      <audio className="audioPlayer" src={this.props.source} controls />
      {this.props.adSource ? <button className="btn waves-effect waves-light" onClick={this.letsMesh}>Mesh</button> : null}
      {this.state.meshFinished ? <audio className="audioPlayer" src={this.state.songUrlObject} controls/> : null}
      </div>
  }
})

module.exports = AudioComponent
