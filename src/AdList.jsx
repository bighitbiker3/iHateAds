var React = require('react');
var SoundPlayer = require('./SoundPlayer');
var ProcessSoundButton = require('./ProcessSoundButton')

var AdList = React.createClass({
  getInitialState: function(){
    return {
      data: []
    }
  },
  fetchAdUrls: function(){
    return
  },
  children: [],
  componentWillMount: function(){
    $.get('/ads')
    .then(data => {
        data.forEach((filename, i) => {
          this.children.push(
            <SoundPlayer
              key = {i}
              source = {'/ads/' + filename}
              adSource = {'/ads/' + filename}
              songUploaded = {this.props.songUploaded}
            />
          )
        })
        this.setState({data: data})
    })

  },
  renderAdList: function(){
    return this.children
  },
  render: function() {
    return <div>
      <h3>Please choose the littest ad for your tune</h3>
      {this.renderAdList()}
    </div>
  }
})

module.exports = AdList
