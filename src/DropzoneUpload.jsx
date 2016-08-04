var React = require('react');
var Dropzone = require('react-dropzone');
var request = require('request');
var SoundPlayer = require('./SoundPlayer');
var AdList = require('./AdList')

var DropzoneComponent = React.createClass({
  getInitialState: function(){
    return {
      showPlayer: false,
      playerSource: '',
    }
  },
  onDrop: function (files) {
    var self = this;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);
    var reader = new FileReader();
    reader.readAsArrayBuffer(files[0])
    var form = new FormData()
    reader.onloadend = function(){
      buffer = reader.result
      var form = new FormData()
      form.append('name', files[0].name)
      form.append('song', files[0])
      xhr.send(form)
    }
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
        console.log(xhr.responseText); // this sends the path back to us
        self.setState({playerSource: xhr.responseText, showPlayer: true});
      }
    }
  },

  render: function () {
    return (
        <div>
          <span>
            <Dropzone onDrop={this.onDrop}>
              <div>Try dropping some files here, or click to select files to upload.</div>
            </Dropzone>
            {this.state.showPlayer ? <SoundPlayer source={this.state.playerSource} /> : null}
          </span>
          {this.state.showPlayer ? <AdList songUploaded = {this.state.playerSource} /> : null}
        </div>
    );
  }
});

module.exports = DropzoneComponent
