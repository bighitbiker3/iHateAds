var React = require('react');
var clientId = '622c5a5338becb1365fb57b6bdc97f09'
var SC = require('soundcloud');
var FirebaseApp = require('./FirebaseApp');
var FirebaseDBRef;

SC.initialize({
  id: '622c5a5338becb1365fb57b6bdc97f09',
  secret: '62cbd53ae84ed38088383a21dbbe18cc',
})

module.exports = React.createClass({
  getInitialState: function(){
    return {
      buttonClicked: false,
      soundcloudLink: '',
    }
  },
  componentWillMount: function(){
    FirebaseDBRef = FirebaseApp.database();
  },
  showInput: function(){
    this.setState({buttonClicked: true})
  },
  handleInput: function(e){
    this.setState({soundcloudLink: e.target.value})
  },
  soundcloudResolve: function(link){
    var resolve = 'https://api.soundcloud.com/resolve?url=';
    var scData;
    $.get(resolve + this.state.soundcloudLink + '&client_id=' + clientId)
    .then(data => {
      console.log(data);
      var songRef = FirebaseDBRef.ref('users/' + FirebaseApp.auth().currentUser.uid + '/songs/' + this.props.FBKey + '/soundcloud')
      songRef.set(data)
    })

  },
  handleSoundCloudSubmit: function(){
    this.soundcloudResolve(this.state.soundcloudLink)
  },
  renderInput: function(){
    return <div>
      <input value={this.state.soundcloudLink} onChange={this.handleInput} placeholder="Soundcloud Link Here" />
      <button className="btn" onClick={this.handleSoundCloudSubmit}>Submit</button>
    </div>
  },
  render: function(){
    PostedToSoundCloudStyle ={
      fontSize: 12,
      marginTop: -100,
      marginRight: 70
    }
    return (
      <div>
        {this.state.buttonClicked ? null : <button style={PostedToSoundCloudStyle} onClick={this.showInput} className="btn right">Posted To Soundcloud?</button>}
        {this.state.buttonClicked ? this.renderInput() : null}
      </div>
    )
  }
})
