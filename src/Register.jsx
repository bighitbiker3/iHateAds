var React = require('react');
var FirebaseApp = require('./FirebaseApp');
var Router = require('react-router');

var FirebaseAuthRef;
var FirebaseDBRef;

module.exports = React.createClass({
  getInitialState: function(){
    return {
      nameText: '',
      emailText: '',
      passwordText: '',
      adProvider: '',
      artist: '',
    }
  },
  componentWillMount: function(){
    FirebaseAuthRef = FirebaseApp.auth();
    FirebaseDBRef = FirebaseApp.database();
  },
  componentDidMount: function(){
    $('select').material_select();
  },
  handleNameInput: function(e){
    this.setState({nameText: e.target.value})
  },
  handleEmailInput: function(e){
    this.setState({emailText: e.target.value})
  },
  handlePasswordInput: function(e){
    this.setState({passwordText: e.target.value})
  },
  handleDropdown: function(e){
    if(e.target.value === '1') this.setState({artist: true, adProvider: false})
    else if(e.target.value === '2') this.setState({artist: false, adProvider: true})
  },
  registerUser: function(){
    let email = this.state.emailText;
    let password = this.state.passwordText;
    let self = this;
    let userId;
    // debugger;
    FirebaseAuthRef.createUserWithEmailAndPassword(email, password)
    .then(user => {
      userId = user.uid
      return user.updateProfile({
        displayName: self.state.nameText,
      })
    })
    .then(() => {
      return FirebaseDBRef.ref('users/' + userId).set({
        email: self.state.emailText,
        name: self.state.nameText,
        adProvider: self.state.adProvider,
        artist: self.state.artist
      })
    })
    .catch(error => console.log(error))
    Router.browserHistory.push('/')
  },
  render: function(){
    return (
      <div className="row">
        <div className="col s6 offset-s3">
          <label>Browser Select</label>
          <select onChange={this.handleDropdown} className="browser-default">
            <option value="" disabled selected>I Am...</option>
            <option value="1">Artist</option>
            <option value="2">Ad Provider</option>
          </select>
            <div className="row">
              <div className="input-field col s12">
                <input id="full_name" type="text" value={this.state.nameText} onChange={this.handleNameInput} className="validate"/>
                <label htmlFor="name">Name</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input id="email" type="email" value={this.state.emailText} onChange={this.handleEmailInput} className="validate"/>
                <label htmlFor="email">Email Address</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input id="password" type="password" value={this.state.passwordText} onChange={this.handlePasswordInput} className="validate"/>
                <label htmlFor="password">Password</label>
              </div>
            </div>

          <br></br>
          <button onClick={this.registerUser} className="btn">Register</button>
        </div>
      </div>
    )
  }
})
