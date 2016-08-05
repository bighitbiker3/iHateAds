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
        self.setState({playerSource: xhr.responseText, showPlayer: true});
      }
    }
  },
  getUploadedSongName: function(str){
    let newStr = '';
    return str.slice(7, str.length - 4)
  },
  render: function () {
    var playerStyle = {
      marginBottom: 100,

    }

    return (
        <div>
          <span>
            <Dropzone className="dropzone col s12" onDrop={this.onDrop}>
              <a className="btn-floating btn-large waves-effect waves-light"><i className="material-icons">add</i></a>
            </Dropzone>
            {this.state.showPlayer ?  <div id="uploadedTune"><h5>{this.getUploadedSongName(this.state.playerSource)}</h5><SoundPlayer source={this.state.playerSource} /></div> : null}
          </span>
          {this.state.showPlayer ? <AdList songUploaded = {this.state.playerSource} /> : null}
        </div>
    );
  }
});

module.exports = DropzoneComponent
