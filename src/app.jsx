var React = require('react');
var Link = require('react-router').Link;
var ReactFire = require('reactfire');
var firebase = require('firebase');
var FirebaseApp = require('./FirebaseApp');


module.exports = React.createClass({
  mixins: [ReactFire],
  componentWillMount: function(){
    FirebaseApp.auth().onAuthStateChanged(function(user){
      if(user){
        console.log('user logged in', user);
        this.setState({user: user})
      } else {
        this.setState({user: null})
      }
    }.bind(this))
  },
  getInitialState: function(){
    return {
      user: null
    }
  },
  render: function(){
    console.log(this.state.users);
    return  (
      <div>
    <nav>
      <div className="nav-wrapper">
        <Link className="brand-logo" to="/">Me$h</Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          {this.state.user ? <li>hi {this.state.user.displayName}</li> : null}
          {this.state.user ? <li><Link to="/profile">Profile</Link></li> : null}
          <li><a href="badges.html">Stats</a></li>
          <li><Link to="/ads">Ads</Link></li>
          {this.state.user ? null : <li><Link to="/register">Register</Link></li>}
          {this.state.user ? <li><Link to="/logout">Logout</Link></li> : <li><Link to="/login">Login</Link></li>}
        </ul>
      </div>
    </nav>
    {this.props.children.props.route ? <h1 className="titleText">{this.props.children.props.route.title}</h1> : null}
    {this.props.children}
  </div>
    )
  }
})
