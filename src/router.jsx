var React = require('react');
var ReactDOM = require('react-dom');
var Home = require('./Home');
var App = require('./App')
var Test = require('./Test')
var AdList = require('./AdList')
var Router = require('react-router').Router
var Route = require('react-router').Route
var Link = require('react-router').Link
var IndexRoute = require('react-router').IndexRoute
var browserHistory = require('react-router').browserHistory



ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute title="Upload" component={Home}/>
      <Route path="/profile" title="Your Profile" component={Test}/>
      <Route path="/ads" title="Available Ads" component={AdList}/>
    </Route>
  </Router>
), document.querySelector('.app'));
