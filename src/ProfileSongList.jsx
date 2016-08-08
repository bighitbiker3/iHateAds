var React = require('react');
var FirebaseApp = require('./FirebaseApp');
var FirebaseDBRef;
var SoundPlayer = require('./SoundPlayer')
var PostedToSoundCloud = require('./PostedToSoundCloud')

module.exports = React.createClass({
  getInitialState: function(){
    return  {
      songs: []
    }
  },
  componentWillMount: function(){
    let self = this;
    FirebaseDBRef = FirebaseApp.database();
    FirebaseDBRef.ref('users/' + FirebaseApp.auth().currentUser.uid +'/songs').on('value', function(snapshot){
      let arr = [];
      let counter = 0
      snapshot.forEach(child => {
        arr.push({key: child.key, fileLocation: child.val().fileLocation, fileTitle: child.val().fileTitle, ad: child.val().ad, soundcloud: child.val().soundcloud, cpmBid: child.val().cpmBid})
      })
      self.setState({songs: arr})
    })
  },
  renderSongList: function(){
    let children = [];
    this.state.songs.forEach(songObj =>{
      children.push(
        <div className="uploadedTune">
          <h5>{songObj.fileTitle}</h5>
          <SoundPlayer
            source={songObj.fileLocation + '.wav'}
          />
        <p>Ad Meshed: {songObj.ad}</p>
        {songObj.soundcloud ? null : <PostedToSoundCloud FBKey={songObj.key}/>}
      </div>
      )
    })
    return children
  },
  renderSoundCloudData: function(){
    let children = [];
    this.state.songs.forEach(songObj => {
      if(songObj.soundcloud){
        var frameSrc = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + songObj.soundcloud.id +  '&amp;auto_play=false&amp;hide_related=true&amp;show_comments=false&amp;show_user=true&amp;show_reposts=true&amp;visual=true"';
        children.push(
          <div className="uploadedTuneLarge">
            <iframe width="100%" height="150" scrolling="no" src={frameSrc}></iframe>
          <p className="inline soundcloudPlays">Plays: {songObj.soundcloud.playback_count}</p>
          <p className="inline soundcloudMoneyOwed">Money Owed: <strong>${Math.floor((songObj.cpmBid / 100) * (songObj.soundcloud.playback_count / 1000))}</strong></p>
        </div>
        )
      }
    })
    return children
  },
  render: function(){
    return <div className="profileUploads">
      <div className="col s4">
        <h5 className="profileColTitle">Your Meshes</h5>
        {this.renderSongList()}
      </div>
      <div className="col s4 offset-s4">
        <h5 className="profileColTitle">Your Posted Meshes</h5>
        {this.renderSoundCloudData()}
      </div>
      </div>
  }
})
