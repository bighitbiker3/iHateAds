var React = require('react');
var FirebaseApp = require('./FirebaseApp');
var FirebaseDBRef;
var SoundPlayer = require('./SoundPlayer')
var PostedToSoundCloud = require('./PostedToSoundCloud')

module.exports = React.createClass({
  getInitialState: function(){
    return  {
      ads: []
    }
  },
  getAdName: function(str){
    return str.slice(4, str.length - 4)
  },
  componentWillMount: function(){
    let self = this;
    FirebaseDBRef = FirebaseApp.database();
    FirebaseDBRef.ref('users/' + this.props.user.uid +'/ads').on('value', function(snapshot){
      let arr = [];
      let counter = 0
      snapshot.forEach(child=> {
        arr.push({key: child.key, fileLocation: child.val().fileLocation, fileTitle: self.getAdName(child.val().fileLocation), cpmBid: child.val().cpmBid})
        if(child.child('meshes')){
          arr[counter].meshes = []
          FirebaseDBRef.ref('users/' + self.props.user.uid +'/ads/' + child.key + '/meshes').on('value', function(snapshot){
            snapshot.forEach(mesh => {
              arr[counter].meshes.push({key: mesh.key, fileLocation: mesh.val().fileLocation, fileTitle: mesh.val().fileTitle, songKey: mesh.val().songKey, ad: self.getAdName(child.val().fileLocation)})
            })
          })

        }
        counter++
      })

      self.setState({ads: arr})
    })
  },
  getUserName: function(key){
    return FirebaseDBRef.ref('/users/' + key)
  },
  renderAdList: function(){
    let children = [];
    this.state.ads.forEach(adObj =>{
      children.push(
        <div className="uploadedTune">
          <h5>{adObj.fileTitle}</h5>
          <SoundPlayer
            source={adObj.fileLocation}
          />
        <p>CPM Bid: <strong>${adObj.cpmBid / 100}</strong></p>
      </div>
      )
    })
    return children
  },
  renderMeshList: function(){
    let children =[];
    let songIdArr = []
    this.state.ads.forEach(adObj => {
      if(adObj.meshes){
        adObj.meshes.forEach(mesh => {
          children.push(
            <div className="uploadedTune">
              <h5>{mesh.fileTitle}</h5>
              <SoundPlayer
                source={mesh.fileLocation + '.wav'}
              />
            <p>Ad: {mesh.ad} </p>
          </div>
          )
        })
      }
    })
    return children
  },
  render: function(){
    return <div className="profileUploads">

      <div className="row">
        <div className="col s4">
          <h5 className="profileColTitle">Your Ads</h5>
          {this.renderAdList()}
        </div>
        <div className="col s4 offset-s4">
          <h5 className="profileColTitle">Meshes</h5>
          {this.renderMeshList()}
        </div>
      </div>
      </div>
  }
})
