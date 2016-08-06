var React = require('react');
var ReactDOM = require('react-dom');
var Register = require('./Register')
var Home = require('./Home');
var App = require('./App')
var Profile = require('./Profile')
var Logout = require('./Logout')
var Login = require('./Login')
var AdList = require('./AdList')
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var IndexRoute = require('react-router').IndexRoute;
var browserHistory = require('react-router').browserHistory;



ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute title="Upload" component={Home}/>
      <Route path="/profile" title="Your Profile" component={Profile}/>
      <Route path="/ads" title="Available Ads" component={AdList}/>
      <Route path="/register" title="Register Below Pls" component={Register}/>
      <Route path="/logout" title="Thanks for logging out" component={Logout} />
      <Route path="/login" title="Login" component={Login} />
    </Route>
  </Router>
), document.querySelector('.app'));
