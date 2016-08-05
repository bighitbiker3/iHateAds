var React = require('react');
var Link = require('react-router').Link;

module.exports = React.createClass({
  render: function(){

    return  (
      <div>
    <nav>
      <div className="nav-wrapper">
        <Link className="brand-logo" to="/">Mesh$</Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li><Link to="/profile">Profile</Link></li>
          <li><a href="badges.html">Stats</a></li>
          <li><Link to="/ads">Ads</Link></li>
        </ul>
      </div>
    </nav>
    {this.props.children.props.route ? <h1 className="titleText">{this.props.children.props.route.title}</h1> : null}
    {this.props.children}
  </div>
    )
  }
})
