var React = require('react');
var ReactDOM = require('react-dom')
var DropzoneArtist = require('./DropzoneUploadArtist');
var DropzoneAd = require('./DropzoneUploadAd');
var Sound = require('./SoundPlayer');
var FirebaseApp = require('./FirebaseApp');
var NotificationSystem = require('react-notification-system');
var FirebaseDBRef;

var App = React.createClass({
  getInitialState: function(){
    return {
      artist: false,
      adProvider: false,
      user: null
    }
  },
  componentDidMount: function(){
    this._notificationSystem = this.refs.notificationSystem;
  },
  _notificationSystem: null,
  noCPMBidNotification: function(){
    this._notificationSystem.addNotification({
      message: "You're not going to get very far if you ain't payin'. Please put in a CPM Bid",
      level: 'error'
    });
  },
  adSuccessNotification: function(){
    this._notificationSystem.addNotification({
      message: "Your ad is now in your profile and available to artists!",
      level: 'success'
    });
  },
  songMeshSuccessNotification: function(){
        event.preventDefault();
    this._notificationSystem.addNotification({
      message: "Your song has been meshed and is available in your profile!",
      level: 'success'
    });
  },
  songUploadSuccessNotification: function(){
    this._notificationSystem.addNotification({
      message: "Your song has has been uploaded :) ",
      level: 'success'
    });
  },
  componentWillMount: function(){
    FirebaseApp.auth().onAuthStateChanged(function(user){
      if(user){
        this.setState({user: user})
        this.getUserStatus(user)
      }
    }.bind(this))

  },
  getUserStatus: function(user){
    if(user) {
      FirebaseDBRef = FirebaseApp.database().ref('users/' + user.uid)
      FirebaseDBRef.once('value').then(snapshot => {
        this.setState({artist: snapshot.val().artist, adProvider: snapshot.val().adProvider})
      })
    }
  },
  render: function() {
    return <app>
    <NotificationSystem ref="notificationSystem" />
    <div className="container">
      {this.state.artist ? <DropzoneArtist songUploadSuccessNotification={this.songUploadSuccessNotification} songMeshSuccessNotification={this.songMeshSuccessNotification} user={this.state.user} /> : null}
      {this.state.adProvider ? <DropzoneAd noCPMBidNotification={this.noCPMBidNotification} adSuccessNotification={this.adSuccessNotification} user={this.state.user}/> : null}
    </div>
  </app>

  }
});

module.exports = App;
// var element = React.createElement(Hello, {});
