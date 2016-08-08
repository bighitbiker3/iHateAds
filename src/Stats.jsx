var React = require('react');
var LineChart = require("react-chartjs").Line;


function rand(min, max, num) {
  var rtn = [];
  while (rtn.length < num) {
    rtn.push((Math.floor(Math.random() * (max - min))) + min);
  }
  return rtn;
}

var chartData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
          datasets: [
              {
                  label: "2016 Earnings",
                  fillColor: "rgba(220,220,220,0.2)",
                  strokeColor: "rgba(220,220,220,1)",
                  pointColor: "rgba(220,220,220,1)",
                  pointStrokeColor: "#fff",
                  pointHighlightFill: "#fff",
                  pointHighlightStroke: "rgba(220,220,220,1)",
                  data: rand(32, 100, 7)
              },
              {
                  label: "2015 Earnings",
                  fillColor: "rgba(151,187,205,0.2)",
                  strokeColor: "rgba(151,187,205,1)",
                  pointColor: "rgba(151,187,205,1)",
                  pointStrokeColor: "#fff",
                  pointHighlightFill: "#fff",
                  pointHighlightStroke: "rgba(151,187,205,1)",
                  data: rand(32, 100, 7)
              }
          ]
};

var chartOptions = {
  scales: {
    yAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'probability'
      }
    }]
  }
}

module.exports = React.createClass({
  render: function() {
    return (
      <div className="center">
        <h5>Earnings</h5>
        <LineChart data={chartData} options={chartOptions} width="800" height="400"/>
      </div>
    )
  }
});
