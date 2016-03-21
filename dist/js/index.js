// Put event listeners into place
window.addEventListener("DOMContentLoaded", function() {
  // Grab elements, create settings, etc.
  var canvas = document.getElementById("outputCanvas"),
  context = canvas.getContext("2d"),
  video = document.getElementById("camera"),
  videoObj = { "video": true },
  errBack = function(error) {
    console.log("Video capture error: ", error.code); 
  };

  if(navigator.getUserMedia) {
    navigator.getUserMedia(videoObj, function(stream) {
      video.src = stream;
      video.play();
    }, errBack);
  } else if(navigator.webkitGetUserMedia) {
    navigator.webkitGetUserMedia(videoObj, function(stream){
      video.src = window.URL.createObjectURL(stream);
      video.play();
    }, errBack);
  } else if(navigator.mozGetUserMedia) {
    navigator.mozGetUserMedia(videoObj, function(stream){
      video.src = window.URL.createObjectURL(stream);
      video.play();
    }, errBack);
  }

  var effectsSelect = document.getElementById('effects');

  var WIDTH = 350, HEIGHT = 300;
  var tempCanvas = document.createElement('canvas');
  tempCanvas.height = HEIGHT;
  tempCanvas.width = WIDTH;
  var tempContext = tempCanvas.getContext('2d');
  var onprogress = function() {
    tempContext.drawImage(video, 0, 0, WIDTH, HEIGHT);
    var imgData = tempContext.getImageData(0, 0, WIDTH, HEIGHT);
    context.putImageData(imageProcess[effectsSelect.value](imgData), 0, 0);
  }
  setInterval(onprogress, 50);
}, false);

