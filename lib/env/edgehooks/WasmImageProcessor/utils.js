const VALID_IMG_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];

async function getWasmModule(wasmFromBuilder) {
  const wasmString = wasmFromBuilder.default;

  // Wasm format after inject: 'data:application/wasm;base64,BASE_64_STRING'
  const wasmBytes = atob(wasmString.split('application/wasm;base64,')[1]);
  const wasmArray = new Uint8Array(wasmBytes.length);
  for (let i = 0; i < wasmBytes.length; i++) {
    wasmArray[i] = wasmBytes.charCodeAt(i);
  }

  const wasmModule = await WebAssembly.compile(wasmArray);

  return wasmModule;
}

function isUrl(pathOrUrl) {
  try {
    new URL(pathOrUrl);

    return true;
  } catch (err) {
    return false;
  }
}

function getFileExtension(pathOrUrl) {
  let extension;
  if (isUrl(pathOrUrl)) {
    const requestUrl = new URL(pathOrUrl);
    extension = requestUrl.pathname.split('.').pop();
  } else {
    extension = pathOrUrl.split('.').pop();
  }

  return extension;
}

function hasValidImageExtension(pathOrUrl) {
  const extension = getFileExtension(pathOrUrl);
  const hasValidExtension = VALID_IMG_EXTENSIONS.includes(extension);

  return hasValidExtension;
}

export {
  getWasmModule,
  isUrl,
  getFileExtension,
  VALID_IMG_EXTENSIONS,
  hasValidImageExtension,
};
