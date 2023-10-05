import path from 'path-browserify';

/* eslint-disable */

const MEM_FILES = globalThis.__FILES__;

// ### fs polyfill utils
/**
 * Get available files in worker memory
 * @returns {string[]} list of mapped files paths
 */
function getAvailableFiles() {
  if (MEM_FILES && typeof MEM_FILES === 'object') return Object.keys(MEM_FILES);

  return [];
}

/**
 * Get available dirs based on mapped files
 * @param {string[]} - files paths
 * @returns {string[]} - list of available dirs
 */
function getAvailableDirs(files) {
  if (files.length > 0) {
    const existingDirs = new Set();

    files.forEach((filePath) => {
      const dirPath = path.dirname(filePath);

      let currentPath = '';
      let pathSegments = dirPath.split('/');
      for (let i = 0; i < pathSegments.length; i++) {
        currentPath = path.join(currentPath, pathSegments[i]);
        if (!existingDirs.has(currentPath)) {
          existingDirs.add(currentPath);
        }
      }
    });

    const dirs = Array.from(existingDirs);

    return dirs;
  }

  return [];
}

/**
 * Get mapped files infos
 * @returns {object} - object with files, dirs and paths
 */
function getFilesInfos() {
  const files = getAvailableFiles();
  const dirs = getAvailableDirs(files);

  return {
    files,
    dirs,
    paths: [...files, ...dirs],
  };
}

/**
 * Returns a valid path
 * @returns {string} - path to fix
 */
function getValidPath(path) {
  if (path.endsWith('/')) path = path.slice(0, -1);

  return path;
}

function generateDefaultStat() {
  const defaultDate = new Date();

  return {
    dev: 16777231,
    mode: 33188,
    nlink: 1,
    uid: 503,
    gid: 20,
    rdev: 0,
    blksize: 4096,
    ino: 99415867,
    size: 4037,
    blocks: 8,
    atimeMs: 1696531597782.944,
    mtimeMs: 1696531596158.1772,
    ctimeMs: 1696531596158.1772,
    birthtimeMs: 1695652120928.4453,
    atime: defaultDate,
    mtime: defaultDate,
    ctime: defaultDate,
    birthtime: defaultDate,
  };
}

// ### fs polyfill methods
// code based on node implementations

const kEmptyObject = ObjectFreeze({ __proto__: null });

function defaultCloseCallback(err) {
  if (err != null) throw err;
}

/**
 * Closes the file descriptor.
 * @param {number} fd
 * @param {(err?: Error) => any} [callback]
 * @returns {void}
 */
function close(fd, callback = defaultCloseCallback) {
  setTimeout(() => {
    // (In-memory implementation doesn't require explicit closing)
    callback(null);
  }, 0);
}

/**
 * Synchronously closes the file descriptor.
 * @param {number} fd
 * @returns {void}
 */
function closeSync(fd) {
  // (In-memory implementation doesn't require explicit closing)
}

/**
 * Asynchronously opens a file.
 * @param {string | Buffer | URL} path
 * @param {string | number} [flags]
 * @param {string | number} [mode]
 * @param {(
 *   err?: Error,
 *   fd?: number
 *   ) => any} callback
 * @returns {void}
 */
function open(path, flags, mode, callback) {
  // handle function args (code from node)
  if (arguments.length < 3) {
    callback = flags;
    flags = 'r';
    mode = 0o666;
  } else if (typeof mode === 'function') {
    callback = mode;
    mode = 0o666;
  } else {
    mode = 0o666;
  }

  setTimeout(() => {
    path = getValidPath(path);
    const file = MEM_FILES[path];
    if (file !== undefined) {
      const fileDescriptor = Symbol(`File Descriptor for ${path}`);

      callback(null, fileDescriptor);
    } else {
      const error = new Error(
        `ENOENT: no such file or directory, fs.open call for path '${path}'`,
      );
      error.code = 'ENOENT';

      callback(error);
    }
  }, 0);
}

/**
 * Synchronously opens a file.
 * @param {string | Buffer | URL} path
 * @param {string | number} [flags]
 * @param {string | number} [mode]
 * @returns {number}
 */
function openSync(path, flags, mode) {
  path = getValidPath(path);
  const file = MEM_FILES[path];
  if (file !== undefined) {
    const fileDescriptor = Symbol(`File Descriptor for ${path}`);

    return fileDescriptor;
  } else {
    const error = new Error(
      `ENOENT: no such file or directory, fs.openSync call for path '${path}'`,
    );
    error.code = 'ENOENT';

    throw error;
  }
}

/**
 * Asynchronously gets the stats of a file.
 * @param {string | Buffer | URL} path
 * @param {{ bigint?: boolean; }} [options]
 * @param {(
 *   err?: Error,
 *   stats?: any
 *   ) => any} callback
 * @returns {void}
 */
async function stat(path, options = { bigint: false }, callback) {
  // handle function args (code from node)
  if (typeof options === 'function') {
    callback = options;
    options = kEmptyObject;
  }

  path = getValidPath(path);

  setTimeout(() => {
    const filesInfos = getFilesInfos();
    if (!filesInfos.paths.includes(path)) {
      const error = new Error(
        `ENOENT: no such file or directory, fs.stat call for path '${path}'`,
      );
      error.code = 'ENOENT';
      callback(error);
    }

    const file = MEM_FILES[path];
    const isFile = filesInfos.files.includes(path);
    const size = isFile ? file.content.length : 0;

    // generate file informations
    const stats = generateDefaultStat();
    stats.size = size;
    stats.isFile = () => isFile;
    stats.isDirectory = () => !isFile;

    callback(null, stats);
  }, 0);
}

/**
 * Synchronously retrieves the `fs.Stats`
 * for the `path`.
 * @param {string | Buffer | URL} path
 * @param {{
 *   bigint?: boolean;
 *   throwIfNoEntry?: boolean;
 *   }} [options]
 * @returns {any}
 */
function statSync(path, options) {
  // checks final /
  path = getValidPath(path);

  // Synchronous method to get file information
  const filesInfos = getFilesInfos();
  if (!filesInfos.paths.includes(path)) {
    const error = new Error(
      `ENOENT: no such file or directory, fs.statSync call for path '${path}'`,
    );
    error.code = 'ENOENT';
    throw error;
  }

  const file = MEM_FILES[path];

  const isFile = filesInfos.files.includes(path);
  const size = isFile ? file.content.length : 0;

  // generate file informations
  const stats = generateDefaultStat();
  stats.size = size;
  stats.isFile = () => isFile;
  stats.isDirectory = () => !isFile;

  return stats;
}

/**
 * Asynchronously reads the entire contents of a file.
 * @param {string | Buffer | URL | number} path
 * @param {{
 *   encoding?: string | null;
 *   flag?: string;
 *   signal?: AbortSignal;
 *   } | string} [options]
 * @param {(
 *   err?: Error,
 *   data?: string | Buffer
 *   ) => any} callback
 * @returns {void}
 */
function readFile(path, options, callback) {
  // handle function args
  if (typeof options === 'functions') {
    callback = options;
    options = { encoding: 'utf-8', flag: 'r' };
  }

  path = getValidPath(path);

  setTimeout(() => {
    const file = MEM_FILES[path];
    if (file !== undefined) {
      callback(null, file.content);
    } else {
      const error = new Error(
        `ENOENT: no such file or directory, fs.readFile call for path '${path}'`,
      );
      error.code = 'ENOENT';
      callback(error);
    }
  }, 0);
}

/**
 * Synchronously reads the entire contents of a file.
 * @param {string | Buffer | URL | number} path
 * @param {{
 *   encoding?: string | null;
 *   flag?: string;
 *   }} [options]
 * @returns {string | Buffer}
 */
function readFileSync(path, options) {
  path = getValidPath(path);
  const file = MEM_FILES[path];
  if (file !== undefined) {
    return file.content;
  } else {
    const error = new Error(
      `ENOENT: no such file or directory, fs.readFileSync call for path '${path}'`,
    );
    error.code = 'ENOENT';
    throw error;
  }
}

const promises = { readFile, stat };

const fs = {
  close,
  closeSync,
  open,
  openSync,
  stat,
  statSync,
  readFile,
  readFileSync,
  promises,
};

export default fs;

/* eslint-enable */
