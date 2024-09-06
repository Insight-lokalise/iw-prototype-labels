
export function productImageToRender(image){

  function isValidImage(value) {
    return !!value && value !== 'image.not.available'
  }
  if(!image) {
    return '/content/dam/insight-web/source/img/noImageAvailable_150x112.png'
  } else if(isValidImage(image.extraLargeImage)){
    return image.extraLargeImage;
  } else if(isValidImage(image.largeImage)){
    return image.largeImage;
  } else if(isValidImage(image.smallImage)){
    return image.smallImage;
  } else if(isValidImage(image.manufacturerExtraLargeImage)){
    return image.manufacturerExtraLargeImage;
  } else if(isValidImage(image.manufacturerLargeImage)){
    return image.manufacturerLargeImage;
  } else if(isValidImage(image.manufacturerSmallImage)){
    return image.manufacturerSmallImage;
  } else {
    return '/content/dam/insight-web/source/img/noImageAvailable_150x112.png'
  }

};
