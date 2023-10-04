/* eslint-disable */

function closeSync(fd) {
  // Synchronous method to close a file descriptor
  // (In-memory implementation doesn't require explicit closing)
}

function openSync(path, flags, mode) {
  // Synchronous method to open a file and return a file descriptor
  // (In-memory implementation doesn't handle modes)
  const file = globalThis.__FILES__[path] || null;
  if (!file) {
    const error = new Error(
      `ENOENT: no such file or directory, open '${path}'`,
    );
    throw error;
  }

  // Return a fake file descriptor (could be an index or any unique identifier)
  return Symbol(`File Descriptor for ${path}`);
}

function readFileSync(fd, buffer, offset, length, position) {
  // Synchronous method to read data from a file descriptor
  const file = globalThis.__FILES__[fd.toString()] || null;
  if (!file) {
    const error = new Error(`EBADF: bad file descriptor`);
    throw error;
  }

  const bytesRead = file.content.copy(
    buffer,
    offset,
    position,
    position + length,
  );
  return bytesRead;
}

function statSync(path) {
  // Synchronous method to get file information
  const file = globalThis.__FILES__[path] || null;
  if (!file) {
    const error = new Error(
      `ENOENT: no such file or directory, stat '${path}'`,
    );
    throw error;
  }

  // Basic file information
  return {
    size: file.content.length,
    mtime: new Date(),
    isFile: () => true,
    isDirectory: () => false,
  };
}

async function readFile(path, options) {
  // Asynchronous method to read a file
  return new Promise((resolve, reject) => {
    const file = globalThis.__FILES__[path] || null;
    if (!file) {
      const error = new Error(
        `ENOENT: no such file or directory, open '${path}'`,
      );
      return reject(error);
    }

    const encoding = options && options.encoding ? options.encoding : 'utf8';
    const content = file.content.toString(encoding);
    resolve(content);
  });
}

async function stat(path) {
  // Asynchronous method to get file information
  return new Promise((resolve, reject) => {
    const file = globalThis.__FILES__[path] || null;
    if (!file) {
      const error = new Error(
        `ENOENT: no such file or directory, stat '${path}'`,
      );
      return reject(error);
    }

    // Basic file information
    const stats = {
      size: file.content.length,
      mtime: new Date(),
      isFile: () => true,
      isDirectory: () => false,
    };

    resolve(stats);
  });
}

const promises = { readFile, stat };

export {
  closeSync,
  openSync,
  readFileSync,
  statSync,
  promises,
  readFile,
  stat,
};
export default {
  closeSync,
  openSync,
  readFileSync,
  statSync,
  promises,
  readFile,
  stat,
};

/* eslint-enable */
