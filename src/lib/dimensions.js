'use strict';

var _ = require('lodash');


function gravity(g, width, height, cropWidth, cropHeight){
  var x, y;

  // set the default x/y, same as gravity 'c' for center
  x = width/2 - cropWidth/2;
  y = height/2 - cropHeight/2;

  switch(g){
  case 'n':
    y = 0;
    break;
  case 'ne':
    x = width - cropWidth;
    y = 0;
    break;
  case 'nw':
    x = 0;
    y = 0;
    break;
  case 's':
    y = height - cropHeight;
    break;
  case 'se':
    x = width - cropWidth;
    y = height - cropHeight;
    break;
  case 'sw':
    x = 0;
    y = height - cropHeight;
    break;
  case 'e':
    x = width - cropWidth;
    break;
  case 'w':
    x = 0;
    break;
  }

  // make sure we do not return numbers less than zero
  if (x < 0){ x = 0; }
  if (y < 0){ y = 0; }

  return {
    x: Math.floor(x),
    y: Math.floor(y)
  };
}
exports.gravity = gravity;


function xy(modifiers, width, height, cropWidth, cropHeight){
  var x,y, dims;

  dims = gravity(modifiers.gravity, width, height, cropWidth, cropHeight);

  if (_.has(modifiers, 'x')){
    x = modifiers.x;
    if (x <= width - cropWidth){
      dims.x = modifiers.x;
    }else{
      // don't ignore modifier dimension
      // instead, place within bounds
      dims.x = width - cropWidth;
    }
  }

  if (_.has(modifiers, 'y')){
    y = modifiers.y;
    if (y <= height - cropHeight){
      dims.y = modifiers.y;
    }else{
      // don't ignore modifier dimension
      // instead, place within bounds
      dims.y = height - cropHeight;
    }
  }

  return dims;
}
exports.xy = xy;


exports.cropFill = function(modifiers, size){
  var wd, ht,
      newWd, newHt,
      cropWidth, cropHeight,
      crop;

  if (modifiers.width === null){
    modifiers.width = modifiers.height;
  }
  if (modifiers.height === null){
    modifiers.height = modifiers.width;
  }

  if (modifiers.width > size.width && modifiers.height <= size.height) {
    cropWidth = size.width;
    cropHeight = modifiers.height;
  } else if (modifiers.width <= size.width && modifiers.height > size.height) {
    cropWidth = modifiers.width;
    cropHeight = size.height;
  } else if (modifiers.width > size.width && modifiers.height > size.height) {
    cropWidth = size.width;
    cropHeight = size.height;
  } else {
    cropWidth = modifiers.width;
    cropHeight = modifiers.height;
  }

  wd = newWd = cropWidth;
  ht = newHt = Math.round(newWd*(size.height/size.width));

  if(newHt < cropHeight) {
    ht = newHt = cropHeight;
    wd = newWd = Math.round(newHt*(size.width/size.height));
  }

  // get the crop X/Y as defined by the gravity or x/y modifiers
  crop = xy(modifiers, newWd, newHt, cropWidth, cropHeight);

  return {
    resize: {
      width: wd,
      height: ht
    },
    crop: {
      width: cropWidth,
      height: cropHeight,
      x: crop.x,
      y: crop.y
    }
  };
};

exports.cropFillUp = function(modifiers, size){
  var wd, ht,
      newWd, newHt,
      cropWidth, cropHeight,
      crop;

  if (modifiers.width === null){
    modifiers.width = modifiers.height;
  }
  if (modifiers.height === null){
    modifiers.height = modifiers.width;
  }

  if (modifiers.width > size.width && modifiers.height <= size.height) {
    cropWidth = modifiers.width;
    cropHeight = modifiers.height;
  } else if (modifiers.width <= size.width && modifiers.height > size.height) {
    cropWidth = modifiers.width;
    cropHeight = modifiers.height;
  } else if (modifiers.width > size.width && modifiers.height > size.height) {
    cropWidth = modifiers.width;
    cropHeight = modifiers.height;
  } else {
    cropWidth = modifiers.width;
    cropHeight = modifiers.height;
  }

  wd = newWd = cropWidth;
  ht = newHt = Math.round(newWd*(size.height/size.width));

  if(newHt < cropHeight) {
    ht = newHt = cropHeight;
    wd = newWd = Math.round(newHt*(size.width/size.height));
  }

  // get the crop X/Y as defined by the gravity or x/y modifiers
  crop = xy(modifiers, newWd, newHt, cropWidth, cropHeight);

  return {
    resize: {
      width: wd,
      height: ht
    },
    crop: {
      width: cropWidth,
      height: cropHeight,
      x: crop.x,
      y: crop.y
    }
  };
};

exports.cropPercent = function(modifiers, size){
  if (modifiers.width === null){
    modifiers.width = modifiers.height;
  }
  if (modifiers.height === null){
    modifiers.height = modifiers.width;
  }

  modifiers.tx = modifiers.tx || 0;
  modifiers.ty = modifiers.ty || 0;
  modifiers.bx = modifiers.bx || 1;
  modifiers.by = modifiers.by || 1;

  return {
    crop: {
      width:  Math.round((modifiers.bx - modifiers.tx) * size.width),
      height: Math.round((modifiers.by - modifiers.ty) * size.height),
      x:      Math.round(modifiers.tx * size.width),
      y:      Math.round(modifiers.ty * size.height)
    }
  };
};
