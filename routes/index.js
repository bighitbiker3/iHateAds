var express = require('express');
var router = express.Router();
var fs = require('fs');
var multiparty = require('multiparty');
var path = require('path')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html');
});

router.post('/upload', function(req, res, next) {
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    fs.readFile(files.song[0].path, function(err, data){
      if(err) {
        throw err
        res.send('There was an error')
      } else {
        fs.writeFile('/upload/' + files.song[0].originalFilename, data, function(err){
          if(err) throw err
          res.send('upload/' + files.song[0].originalFilename)
        })
      }
    })
  })
});

router.post('/upload/ads', function(req, res, next) {
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    fs.readFile(files.song[0].path, function(err, data){
      if(err) {
        throw err
        res.send('There was an error')
      } else {
        fs.writeFile('/Users/El_Is_Based/fullstackSenior/iHateAds/public/ads/' + files.song[0].originalFilename, data, function(err){
          if(err) throw err
          res.send('ads/' + files.song[0].originalFilename)
        })
      }
    })
  })
});
router.post('/upload/meshed', function(req, res, next) {
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    fs.readFile(files.song[0].path, function(err, data){
      if(err) {
        throw err
        res.send('There was an error')
      } else {
        fs.writeFile('/Users/El_Is_Based/fullstackSenior/iHateAds/public/upload/meshed/' + files.song[0].originalFilename + '.wav', data, function(err){
          if(err) throw err
          res.send('upload/meshed/' + files.song[0].originalFilename)
        })
      }
    })
  })
});

router.get('/ads', function(req, res, next){
  fs.readdir('/Users/El_Is_Based/fullstackSenior/iHateAds/public/ads', function(err, data){
    if (err) throw err;
    console.log(data);
    res.send(data)
  })
})
module.exports = router;
