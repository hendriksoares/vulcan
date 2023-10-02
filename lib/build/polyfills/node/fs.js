/* eslint-disable */

function readFileSync(path, options) {
  return globalThis.__FILES__[path];
}

function statSync(path) {
  return path in globalThis.__FILES__;
}

async function readFile(path, options) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const result = globalThis.__FILES__[path];
        resolve(result);
      } catch (error) {
        reject(new Error(`Error in readFile: ${error.message}`));
      }
    }, 0);
  });
}

async function stat(path, callback) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const result = path in globalThis.__FILES__;
        resolve(result);
      } catch (error) {
        reject(new Error(`Error in stat: ${error.message}`));
      }
    }, 0);
  });
}

const promises = {
  readFile,
  stat,
};

export { statSync, readFileSync, stat, readFile, promises };

/* eslint-enable */
