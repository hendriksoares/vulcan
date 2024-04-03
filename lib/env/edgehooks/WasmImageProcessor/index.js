/* eslint-disable import/extensions */
/* eslint-disable class-methods-use-this */

import * as photon from './photon/index.js';
import * as png from './png/index.js';

import {
  isUrl,
  hasValidImageExtension,
  VALID_IMG_EXTENSIONS,
} from './utils.js';

let image = null;
let result = null;

async function loadImage(pathOrURL) {
  if (!hasValidImageExtension(pathOrURL)) {
    throw new Error(
      `Invalid image extension. Supported: ${VALID_IMG_EXTENSIONS.join(',')}`,
    );
  }

  let imageUrl;
  if (isUrl(pathOrURL)) {
    imageUrl = pathOrURL;
  } else {
    imageUrl = new URL(pathOrURL, 'file://');
  }

  const imageResp = await fetch(imageUrl);

  if (!imageResp.ok) {
    throw new Error('Error getting image. Http status code:', imageResp.status);
  }

  const imageBuffer = await imageResp.arrayBuffer();
  const imageBytes = new Uint8Array(imageBuffer);

  image = photon.PhotonImage.new_from_byteslice(imageBytes);
}

function checkImage() {
  if (image === null) {
    throw new Error("Must load image before! Use 'loadImage' function.");
  }
}

function checkResult() {
  if (result === null) {
    throw new Error('Must run an image processing operation before return.');
  }
}

function cleanEnv() {
  image.free();

  image = null;
  result = null;
}

function getDimensionPercent(isWidth, value) {
  checkImage();

  let dimensionValue;
  if (isWidth) {
    dimensionValue = image.get_width();
  } else {
    dimensionValue = image.get_height();
  }

  const percent = (value * 100.0) / dimensionValue;

  return percent;
}

async function resize(width, height, usePercent = true) {
  checkImage();

  const imageWidth = image.get_width();
  const imageHeight = image.get_height();

  let widthPercent;
  let heightPercent;
  if (!usePercent) {
    widthPercent = getDimensionPercent(true, width);
    heightPercent = getDimensionPercent(false, height);
  } else {
    widthPercent = width;
    heightPercent = height;
  }

  result = photon.resize(
    image,
    imageWidth * widthPercent,
    imageHeight * heightPercent,
    1,
  );
}

function getPngImage() {
  checkResult();

  const image = png.encode(
    result.get_raw_pixels(),
    result.get_width(),
    result.get_height(),
  );

  return image;
}

function getPngResponse() {
  const image = getPngImage();

  const imageResponse = new Response(image, {
    headers: {
      'Content-Type': 'image/png',
    },
  });

  cleanEnv();

  return imageResponse;
}

const WasmImageProcessor = {
  loadImage,
  resize,
  getPngResponse,
};

export default WasmImageProcessor;
