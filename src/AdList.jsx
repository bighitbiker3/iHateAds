var React = require('react');
var SoundPlayer = require('./SoundPlayer');
var ProcessSoundButton = require('./ProcessSoundButton');
var FirebaseApp = require('./FirebaseApp');
var FirebaseDBRef = FirebaseApp.database();

var AdList = React.createClass({
  getInitialState: function(){
    return {
      data: [],
      ads: [],
      fetchingData: false
    }
  },
  fetchAdUrls: function(){
    return
  },
  getAdName: function(str){
    return str.slice(4, str.length -4);
  },
  componentWillMount: function(){
    this.setState({fetchingData: true})
    FirebaseDBRef.ref('ads').once('value')
    .then(snapshot => {
      snapshot.forEach((child, i) =>{
        this.state.ads.push(
          <div style={{marginLeft: 10}} className={this.props.location && this.props.location.pathname === '/ads' ? "uploadedTune" : null}>
          <h5>{this.getAdName(child.val().fileLocation)}</h5>
          <SoundPlayer
            songMeshSuccessNotification={this.props.songMeshSuccessNotification}
            key = {child.key}
            adKey = {child.val().userAdKey}
            cpmBid = {child.val().cpmBid}
            adProvider = {child.val().user}
            source = {'/' + child.val().fileLocation}
            adSource = {'/' + child.val().fileLocation}
            songUploaded = {this.props.songUploaded}
            addSongToProfile={this.props.addSongToProfile}
          />
      </div>
        )
      })
      this.setState({fetchingData: false})
    })
  },
  componentWillUnmount: function(){
    this.setState({data: []})
  },
  renderAdList: function(){
    return this.state.ads
  },
  render: function() {
    return <div>
      {this.renderAdList()}
      {this.state.fetchingData ? <img src="/images/loader.gif"/> : null}
    </div>
  }
})

module.exports = AdList
