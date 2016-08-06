var React = require('react');
var FirebaseApp = require('./FirebaseApp');
var FirebaseDBRef;
var ReactFire = require('reactfire');
var ProfileSongList = require('./ProfileSongList');
var ProfileAdList = require('./ProfileAdList');

module.exports = React.createClass({
  getInitialState: function(){
    return {
      artist: false,
      adProvider: false,
      user: null,
      songs: []
    }
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
  render: function(){
    return (
    <div>
      <div className="row">
      {this.state.artist ? <ProfileSongList user={this.state.user} /> : null}
      {this.state.adProvider ? <ProfileAdList user={this.state.user} /> : null}
      </div>
    </div>
    )
  }
})
