//_get(imgData, x, y)
//@param imgData: canvas.getContext('2d') 的图像对象，
//                data(length, 类数组), width, height
//@param x 坐标，从 0 开始
//@param y
//返回 x y 处 rgba 值。 [r,g,b,a]
//
//_getX(imgData, x, y) x:R G B A
//
//_set(imgData, x, y, r, g, b, a)
//设置值， rgba 取值 0-255


var imageProcess = {
};

imageProcess._getIndex = function(imgData, x, y) {
  var w = imgData.width;
  var h = imgData.height;
  var i = y * h + w;
  return (i >= 0 && i < imgData.data.length) ? i : undefined;
}
imageProcess._get = function(imgData, x, y) {
  var i = imageProcess._getIndex(imgData, x, y);
  if (i === undefined) {
    return [];
  }
  var data = imgData.data;
  return [data[i], data[i+1], data[i+2], data[i+3]];
}
imageProcess._getR = function(imgData, x, y) {
  return imageProcess._get(imgData, x, y)[0];
}
imageProcess._getG = function(imgData, x, y) {
  return imageProcess._get(imgData, x, y)[1];
}
imageProcess._getB = function(imgData, x, y) {
  return imageProcess._get(imgData, x, y)[2];
}
imageProcess._getA = function(imgData, x, y) {
  return imageProcess._get(imgData, x, y)[3];
}


imageProcess._set = function(imgData, x, y, r, g, b ,a) {
  var i = imageProcess._getIndex(imgData, x, y);
  if (i === undefined) {
    return ;
  }
  var data = imgData.data;
  if (r !== undefined) {
    data[i] = r;
  }
  if (g !== undefined) {
    data[i+1] = g;
  }
  if (b !== undefined) {
    data[i+2] = b;
  }
  if (a !== undefined) {
    data[i+3] = a;
  }
}
imageProcess._setR = function(imgData, x, y, r) {
  imageProcess._set(imgData, x, y, r);
}
imageProcess._setG = function(imgData, x, y, g) {
  imageProcess._set(imgData, x, y, undefined, g);
}
imageProcess._setB = function(imgData, x, y, b) {
  imageProcess._set(imgData, x, y, undefined, undefined, b);
}
imageProcess._setA = function(imgData, x, y, a) {
  imageProcess._set(imgData, x, y, undefined, undefined, undefined, a);
}

