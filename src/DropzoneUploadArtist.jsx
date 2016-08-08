var React = require('react');
var Dropzone = require('react-dropzone');
var request = require('request');
var SoundPlayer = require('./SoundPlayer');
var AdList = require('./AdList');
var FirebaseApp = require('./FirebaseApp');
var FirebaseDBRef;

var DropzoneComponent = React.createClass({
  getInitialState: function(){
    return {
      showPlayer: false,
      playerSource: '',
      user: {},
      files: []
    }
  },
  onDrop: function (files) {
    this.setState({files: files})
    var self = this;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);
    var form = new FormData()
    form.append('name', files[0].name)
    form.append('song', files[0])
    xhr.send(form)
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
        self.setState({playerSource: xhr.responseText, showPlayer: true});
        self.props.songUploadSuccessNotification()
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
                <div className="fileUploadNameDiv">
                  {this.state.files.length > 0 ? <p className="fileUploadName">{this.state.files[0].name}</p> : null}
                </div>
            </Dropzone>
            {this.state.showPlayer ? <div> <div className="uploadedTune artistTuneUpload col offset-s4"><h5>{this.getUploadedSongName(this.state.playerSource)}</h5><SoundPlayer source={this.state.playerSource} /></div></div> : null}
          </span>
          {this.state.showPlayer ? <div><h4 style={{textAlign: 'center', marginTop: 50}}>Ad Offers</h4><div className="AdListContainer"><AdList songMeshSuccessNotification={this.props.songMeshSuccessNotification} songUploaded = {this.state.playerSource} /></div></div> : null}
        </div>
    );
  }
});

module.exports = DropzoneComponent
