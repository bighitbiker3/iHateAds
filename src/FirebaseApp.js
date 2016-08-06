var firebase = require('firebase');


var config = {
  apiKey: "AIzaSyAHXe6MQowbfuvKql3Ov6N4p04MFrrUh28",
  authDomain: "ihateads-d8853.firebaseapp.com",
  databaseURL: "https://ihateads-d8853.firebaseio.com",
  storageBucket: "ihateads-d8853.appspot.com",
};
var FirebaseApp = firebase.initializeApp(config);

module.exports = FirebaseApp
