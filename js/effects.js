imageProcess.doNothing = function(imgData) {
  return imgData;
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

imageProcess.bw = function(imgData) {
  var data = imgData.data;
  for (var i = 0;i < data.length; i += 4) {
    var g = (data[i]*19595 + data[i+1]*38469 + data[i+2]*7472) >> 16;
    g = (g >= 100) ? 255 : 0;
    data[i] = g;
    data[i+1] = g;
    data[i+2] = g;
  }
  return imgData;
}

imageProcess.emboss = function(imgData) {
  var data = imgData.data;
  var pr = data[0], pg = data[1], pb = data[2];
  for (var i = 4;i < data.length; i += 4) {
    var r = data[i] - pr + 128;
    var g = data[i+1] - pg + 128;
    var b = data[i+2] - pb + 128;
    var c = r * 0.3 + g * 0.59 + b * 0.11;
    pr = data[i];
    pg = data[i+1];
    pb = data[i+2];
    data[i] = data[i+1] = data[i+2] = c;
  }
  return imgData;
}

imageProcess.blur = function(imgData) {
  var top_x = 0;
  var top_y = 0;
  var width = imgData.width;
  var height = imgData.height;
  var radius = 20;

  //Copyed from stackblur.js
  var pixels = imgData.data;

  var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, 
  r_out_sum, g_out_sum, b_out_sum, a_out_sum,
  r_in_sum, g_in_sum, b_in_sum, a_in_sum, 
  pr, pg, pb, pa, rbs;

  var div = radius + radius + 1;
  var w4 = width << 2;
  var widthMinus1  = width - 1;
  var heightMinus1 = height - 1;
  var radiusPlus1  = radius + 1;
  var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;

  var stackStart = new BlurStack();
  var stack = stackStart;
  for ( i = 1; i < div; i++ )
  {
    stack = stack.next = new BlurStack();
    if ( i == radiusPlus1 ) var stackEnd = stack;
  }
  stack.next = stackStart;
  var stackIn = null;
  var stackOut = null;

  yw = yi = 0;

  var mul_sum = mul_table[radius];
  var shg_sum = shg_table[radius];

  for ( y = 0; y < height; y++ )
  {
    r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;

    r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
    g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
    b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
    a_out_sum = radiusPlus1 * ( pa = pixels[yi+3] );

    r_sum += sumFactor * pr;
    g_sum += sumFactor * pg;
    b_sum += sumFactor * pb;
    a_sum += sumFactor * pa;

    stack = stackStart;

    for( i = 0; i < radiusPlus1; i++ )
    {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack.a = pa;
      stack = stack.next;
    }

    for( i = 1; i < radiusPlus1; i++ )
    {
      p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
      r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
      g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
      b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
      a_sum += ( stack.a = ( pa = pixels[p+3])) * rbs;

      r_in_sum += pr;
      g_in_sum += pg;
      b_in_sum += pb;
      a_in_sum += pa;

      stack = stack.next;
    }


    stackIn = stackStart;
    stackOut = stackEnd;
    for ( x = 0; x < width; x++ )
    {
      pixels[yi+3] = pa = (a_sum * mul_sum) >> shg_sum;
      if ( pa != 0 )
      {
        pa = 255 / pa;
        pixels[yi]   = ((r_sum * mul_sum) >> shg_sum) * pa;
        pixels[yi+1] = ((g_sum * mul_sum) >> shg_sum) * pa;
        pixels[yi+2] = ((b_sum * mul_sum) >> shg_sum) * pa;
      } else {
        pixels[yi] = pixels[yi+1] = pixels[yi+2] = 0;
      }

      r_sum -= r_out_sum;
      g_sum -= g_out_sum;
      b_sum -= b_out_sum;
      a_sum -= a_out_sum;

      r_out_sum -= stackIn.r;
      g_out_sum -= stackIn.g;
      b_out_sum -= stackIn.b;
      a_out_sum -= stackIn.a;

      p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;

      r_in_sum += ( stackIn.r = pixels[p]);
      g_in_sum += ( stackIn.g = pixels[p+1]);
      b_in_sum += ( stackIn.b = pixels[p+2]);
      a_in_sum += ( stackIn.a = pixels[p+3]);

      r_sum += r_in_sum;
      g_sum += g_in_sum;
      b_sum += b_in_sum;
      a_sum += a_in_sum;

      stackIn = stackIn.next;

      r_out_sum += ( pr = stackOut.r );
      g_out_sum += ( pg = stackOut.g );
      b_out_sum += ( pb = stackOut.b );
      a_out_sum += ( pa = stackOut.a );

      r_in_sum -= pr;
      g_in_sum -= pg;
      b_in_sum -= pb;
      a_in_sum -= pa;

      stackOut = stackOut.next;

      yi += 4;
    }
    yw += width;
  }


  for ( x = 0; x < width; x++ )
  {
    g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;

    yi = x << 2;
    r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
    g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
    b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
    a_out_sum = radiusPlus1 * ( pa = pixels[yi+3]);

    r_sum += sumFactor * pr;
    g_sum += sumFactor * pg;
    b_sum += sumFactor * pb;
    a_sum += sumFactor * pa;

    stack = stackStart;

    for( i = 0; i < radiusPlus1; i++ )
    {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack.a = pa;
      stack = stack.next;
    }

    yp = width;

    for( i = 1; i <= radius; i++ )
    {
      yi = ( yp + x ) << 2;

      r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
      g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
      b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
      a_sum += ( stack.a = ( pa = pixels[yi+3])) * rbs;

      r_in_sum += pr;
      g_in_sum += pg;
      b_in_sum += pb;
      a_in_sum += pa;

      stack = stack.next;

      if( i < heightMinus1 )
      {
        yp += width;
      }
    }

    yi = x;
    stackIn = stackStart;
    stackOut = stackEnd;
    for ( y = 0; y < height; y++ )
    {
      p = yi << 2;
      pixels[p+3] = pa = (a_sum * mul_sum) >> shg_sum;
      if ( pa > 0 )
      {
        pa = 255 / pa;
        pixels[p]   = ((r_sum * mul_sum) >> shg_sum ) * pa;
        pixels[p+1] = ((g_sum * mul_sum) >> shg_sum ) * pa;
        pixels[p+2] = ((b_sum * mul_sum) >> shg_sum ) * pa;
      } else {
        pixels[p] = pixels[p+1] = pixels[p+2] = 0;
      }

      r_sum -= r_out_sum;
      g_sum -= g_out_sum;
      b_sum -= b_out_sum;
      a_sum -= a_out_sum;

      r_out_sum -= stackIn.r;
      g_out_sum -= stackIn.g;
      b_out_sum -= stackIn.b;
      a_out_sum -= stackIn.a;

      p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;

      r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
      g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
      b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
      a_sum += ( a_in_sum += ( stackIn.a = pixels[p+3]));

      stackIn = stackIn.next;

      r_out_sum += ( pr = stackOut.r );
      g_out_sum += ( pg = stackOut.g );
      b_out_sum += ( pb = stackOut.b );
      a_out_sum += ( pa = stackOut.a );

      r_in_sum -= pr;
      g_in_sum -= pg;
      b_in_sum -= pb;
      a_in_sum -= pa;

      stackOut = stackOut.next;

      yi += width;
    }
  }
  return imgData;
}

//var _tempCanvasContext = tempCanvas.getContext('2d');
var _tempCanvasContext;
imageProcess.face = function(imgData) {
  if (!_tempCanvasContext) {
    _tempCanvasContext = tempCanvas.getContext('2d');
  }
  var comp = ccv.detect_objects({ "canvas" : (tempCanvas),
                  "cascade" : cascade,
                  "interval" : 5,
                  "min_neighbors" : 1 });
  if (!comp.length) {
    return imgData;
  }

  console.log(comp.length);
  for (var i = 0;i < comp.length; ++i) {
    _tempCanvasContext.moveTo(comp[i].x, comp[i].y);
    _tempCanvasContext.lineTo(comp[i].x+comp[i].width, comp[i].y);
    _tempCanvasContext.lineTo(comp[i].x+comp[i].width, comp[i].y+comp[i].height);
    _tempCanvasContext.lineTo(comp[i].x, comp[i].y+comp[i].height);
    _tempCanvasContext.lineTo(comp[i].x, comp[i].y);
    _tempCanvasContext.lineWidth=3;
    _tempCanvasContext.strokeStyle = 'red';
    _tempCanvasContext.stroke();
  }
  return _tempCanvasContext.getImageData(0, 0, imgData.width, imgData.height);
}
