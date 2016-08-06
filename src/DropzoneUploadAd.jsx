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
      cpmBid: '',
      files: []
    }
  },
  onDrop: function (files) {
    if(this.state.cpmBid === ''){
       this.props.noCPMBidNotification();
    } else {
      files = this.state.files
      var self = this;
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/upload/ads', true);
      var reader = new FileReader();
      reader.readAsArrayBuffer(files[0])
      console.log(files[0]);
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
          self.addInfoToDB(xhr.responseText)
        }
      }
    }

  },
  addInfoToDB: function(fileLoc){
    FirebaseDBRef = FirebaseApp.database();
    FirebaseDBRef.ref('users/' + this.props.user.uid + '/ads').push({
      fileLocation: fileLoc,
      cpmBid: this.state.cpmBid,
    })
    .then(doc => {
      return FirebaseDBRef.ref('ads/').push({
        fileLocation: fileLoc,
        cpmBid: this.state.cpmBid,
        user: this.props.user.uid,
        userAdKey: doc.key
      })
    })
    .then(() => {
      this.props.adSuccessNotification()
    })
    .catch(err => console.log(err))
  },
  handleCPMInput: function(e){
    let inCents = e.target.value * 100;
    this.setState({cpmBid: inCents})
  },
  setFileToState: function(files){
    this.setState({files: files});
  },
  render: function () {
    return (
        <div className="row">
          <span>
            <Dropzone onDrop={this.setFileToState}className="dropzone col s12">
              <a className="btn-floating btn-large waves-effect waves-light"><i className="material-icons">add</i></a>
            </Dropzone>
            <input type="number" style={{textAlign: 'center'}} className="col s4 offset-s4" onChange={this.handleCPMInput} placeholder="CPM Bid?" />
            <button onClick={this.onDrop} className="btn">Upload</button>
          </span>
        </div>
    );
  }
});

module.exports = DropzoneComponent
