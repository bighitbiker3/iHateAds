var React = require('react');
var runMesh = require('../utility/mesh')
var SoundPlayer = require('./SoundPlayer');
var bufferToWav = require('audiobuffer-to-wav');

var ProcessSoundButton = React.createClass({
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
      <button onClick={this.letsMesh}>Mesh</button>

    </div>

  }

})

module.exports = ProcessSoundButton
