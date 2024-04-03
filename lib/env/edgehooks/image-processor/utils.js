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

export { getWasmModule };
