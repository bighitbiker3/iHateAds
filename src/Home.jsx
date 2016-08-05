var React = require('react');
var ReactDOM = require('react-dom')
var Dropzone = require('./DropzoneUpload')
var Sound = require('./SoundPlayer');


var App = React.createClass({
  getInitialState: function(){
    return {
      url: 'http://localhost:8000/upload/song.mp3',
      position: 0,
      volume: 100,
    }
  },
  render: function() {
    return <app>
    <div className="container">
      <h1 className="titleText">Uploaaasssd Your Tune</h1>
      <Dropzone />
    </div>
  </app>

  }
});

module.exports = App;
// var element = React.createElement(Hello, {});
