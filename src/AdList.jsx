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
  getAdName: function(str){
    return str.slice(0, str.length -4);
  },
  children: [],
  componentWillMount: function(){
    $.get('/ads')
    .then(data => {
        data.forEach((filename, i) => {
          this.children.push(
            <div>
            <h5>{this.getAdName(filename)}</h5>
            <SoundPlayer
              key = {i}
              source = {'/ads/' + filename}
              adSource = {'/ads/' + filename}
              songUploaded = {this.props.songUploaded}
            />
        </div>
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
      {this.renderAdList()}
    </div>
  }
})

module.exports = AdList
