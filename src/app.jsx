var React = require('react');
var ReactDOM = require('react-dom')
var Dropzone = require('./DropzoneUpload')
var Sound = require('./SoundPlayer');

var Hello = React.createClass({
  getInitialState: function(){
    return {
      url: 'http://localhost:8000/upload/song.mp3',
      position: 0,
      volume: 100,
    }
  },
  render: function() {
    return <div>
      <h1>My MERN Template :)</h1>
      <Dropzone />
      <h2>Test Element</h2>
      <audio id="lol" controls/>
      <audio className="audio" controls="controls"></audio>
    </div>

  }
});

var element = React.createElement(Hello, {});
ReactDOM.render(element, document.querySelector('.app'));
