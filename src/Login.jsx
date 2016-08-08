var React = require('react');
var FirebaseApp = require('./FirebaseApp');
var Router = require('react-router');

var FirebaseAuthRef;
var FirebaseDBRef;

module.exports = React.createClass({
  getInitialState: function(){
    return {
      emailText: '',
      passwordText: '',
    }
  },
  componentWillMount: function(){
    FirebaseAuthRef = FirebaseApp.auth();
    FirebaseDBRef = FirebaseApp.database();
  },
  handleEmailInput: function(e){
    this.setState({emailText: e.target.value})
  },
  handlePasswordInput: function(e){
    this.setState({passwordText: e.target.value})
  },
  loginUser: function(){
    let email = this.state.emailText;
    let password = this.state.passwordText;
    let self = this;
    FirebaseAuthRef.signInWithEmailAndPassword(email, password)
    .then(user => Router.browserHistory.push('/'))
    .catch(error => console.log(error))
  },
  render: function(){
    return (
      <div className="row">
        <div className="col s6 offset-s3">
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
          <button onClick={this.loginUser} className="btn">Login</button>
        </div>
      </div>
    )
  }
})
