var React = require('react');
var Router = require('react-router');
var FirebaseApp = require('./FirebaseApp');
var FirebaseAuthRef;

module.exports = React.createClass({
  componentWillMount: function(){
    FirebaseAuthRef = FirebaseApp.auth();
    FirebaseAuthRef.signOut()
    .then(() => Router.browserHistory.push('/'))
  },
  render: function(){
    return (
      <p>Oops Something Went Wrong!</p>
    )
  }
})
