var Promise = require('bluebird');


function getPCMArray(location){
  let audio = document.createElement('audio');
  console.log(audio);
  audio.crossOrigin = "anonymous";
  audio.src = location;
  audio.load();
  return new Promise(function(resolve, reject){
    audio.onloadedmetadata = function(){
      console.log('meta data loaded');
      let request = new XMLHttpRequest();
      request.open('GET', location, true);
      request.responseType = 'arraybuffer';
      request.onload = function(){
        console.log('in on load');
        let bufferArray = request.response;
        let songDurationInSamples = 44100 * audio.duration;
        console.log(songDurationInSamples, 'songduration')
        let offlineContext = new OfflineAudioContext(2, songDurationInSamples , 44100);
        offlineContext.decodeAudioData(bufferArray, function(buffer){
          console.log('in decode')
          let source = offlineContext.createBufferSource();
          source.buffer = buffer;
          source.connect(offlineContext.destination);
          source.start(0);
          offlineContext.startRendering();
          offlineContext.oncomplete = function(e) {
            let pcmArrayLeft = e.renderedBuffer.getChannelData(0);
            let pcmArrayRight = e.renderedBuffer.getChannelData(1);
            console.log(pcmArrayLeft, pcmArrayRight);
            resolve({left: pcmArrayLeft, right: pcmArrayRight})
          };
        });
      };
      request.send();
    }
  });


};

//This is doing weighted averaging with each pcm point. Min weight is 50/50;
//ad can be louder if the user wants
let meshPCM = function(mesh1, mesh2, direction, meshWithRatio){
  console.log('in mesh');
  if(meshWithRatio < 0.5) meshWithRatio = 0.5
  let songRatio = parseFloat((1 - ((meshWithRatio - 0.5) * 2)).toFixed(2));
  let adRatio = parseFloat((1 + ((meshWithRatio - 0.5) * 2)).toFixed(2));
  console.log(songRatio, adRatio);
  return mesh1[direction].map((dataPoint, i) => {
    let newi = i-44100
    if(typeof mesh2[direction][newi] !== 'undefined' && i > 44100){
      let newDataPoint = ((songRatio * dataPoint) + (adRatio * mesh2[direction][newi])) / 2;
      return newDataPoint
    }
    else if(i < 44100){
      return dataPoint/2;
    }
    else{
      return dataPoint
    }

  })
}

function runMesh(location1, location2, howAddy, callback){
  Promise.all([getPCMArray(location1), getPCMArray(location2)])
  .spread((song, ad) => {
    console.log(song, ad);
    let meshedLeft = meshPCM(song, ad, 'left', howAddy)
    let meshedRight = meshPCM(song, ad, 'right', howAddy)
    console.log(meshedRight, meshedLeft);
    let audioCxt = new AudioContext()
    let audioBuffer = audioCxt.createBuffer(2, meshedRight.length, audioCxt.sampleRate)
    let bufferSource = audioCxt.createBufferSource();
    audioBuffer.getChannelData(0).set(meshedLeft);
    audioBuffer.getChannelData(1).set(meshedRight);
    callback(audioBuffer)
    bufferSource.buffer = audioBuffer;
    bufferSource.connect(audioCxt.destination);
    // var wav = bufferToWav(audioBuffer);
    // console.log(wav, 'this is WAVVVVVV');
    // var anchor = document.createElement('a')
    // document.body.appendChild(anchor)
    // anchor.style = 'display: none'

    // var url = window.URL.createObjectURL(blob)
    // anchor.href = url
    // anchor.download = 'audio.wav'
    // anchor.click()
    // window.URL.revokeObjectURL(url)
    // bufferSource.start(0);
  })
}

module.exports = runMesh
