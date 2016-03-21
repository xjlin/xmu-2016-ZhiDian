imageProcess.doNothing = function(imgData) {
  return imgData;
}

imageProcess.distort = function(imgData) {

}

imageProcess.gray = function(imgData) {
  var data = imgData.data;
  for (var i = 0;i < data.length; i += 4) {
    var g = (data[i]*19595 + data[i+1]*38469 + data[i+2]*7472) >> 16;
    data[i] = g;
    data[i+1] = g;
    data[i+2] = g;
  }
  return imgData;
}

imageProcess.white = function(imgData) {
  var data = imgData.data;
  var b = 7, lgb = Math.log(b+1);
  for (var i = 0;i < data.length; i += 4) {
    var g = (data[i]*19595 + data[i+1]*38469 + data[i+2]*7472) >> 16;
    data[i] = Math.log(data[i]/255*b+1) / lgb * 255;
    data[i+1] = Math.log(data[i+1]/255*b+1) / lgb * 255;
    data[i+2] = Math.log(data[i+2]/255*b+1) / lgb * 255;
  }
  return imgData;
}

imageProcess.sketch = function(imgData) {
  imgData = imageProcess.gray(imgData);
  var data = imgData.data;
  var w = imgData.width;
  var h = imgData.height;
  var N = new Uint8ClampedArray(w*h);
  var g = new Uint8ClampedArray(w*h);
  var i;
  for (i = 0; i < N.length; ++i) {
    N[i] = 255 - data[i*4];
  }
  var temp;
  for (i = w+1;i < N.length - w; ++i) {
    temp = i % w;
    if (temp === 0 || temp === w-1) {
      continue;
    }
    temp = 0;
    temp = N[i-w-1]+2*N[i-1]+N[i-1+w];
    temp += 2*N[i-w]+4*N[i]+2*N[i+w];
    temp += N[i+1-w]+2*N[i+1]+N[i+1+w];
    g[i] = temp / 16;
  }
  for (i = 0;i < N.length; ++i) {
    var b = g[i];
    var a = data[4*i];

    data[4*i]   = a+a*b/(256-b);
    data[4*i+1] = data[4*i];
    data[4*i+2] = data[4*i];
  }
  return imgData;
}
