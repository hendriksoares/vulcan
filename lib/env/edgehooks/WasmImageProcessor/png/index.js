import { encode as wasmEncode, decode as wasmDecode } from './lib/png.js';

export const ColorType = {
  Grayscale: 0,
  RGB: 2,
  Indexed: 3,
  GrayscaleAlpha: 4,
  RGBA: 6,
};

export const BitDepth = {
  One: 1,
  Two: 2,
  Four: 4,
  Eight: 8,
  Sixteen: 16,
};

export const Compression = {
  Default: 0,
  Fast: 1,
  Best: 2,
  Huffman: 3,
  Rle: 4,
};

export const FilterType = {
  NoFilter: 0,
  Sub: 1,
  Up: 2,
  Avg: 3,
  Paeth: 4,
};

export const encode = (image, width, height, options) => {
  const res = wasmEncode(
    image,
    width,
    height,
    options?.palette,
    options?.trns,
    options?.color ?? ColorType.RGBA,
    options?.depth ?? BitDepth.Eight,
    options?.compression,
    options?.filter,
  );

  return res;
};

export const decode = (image) => {
  const res = wasmDecode(image);

  return {
    image: new Uint8Array(res.image),
    width: res.width,
    height: res.height,
    colorType: res.colorType,
    bitDepth: res.bitDepth,
    lineSize: res.lineSize,
  };
};

export { default, initSync } from './lib/png.js';
