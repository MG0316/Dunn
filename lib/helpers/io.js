const path = require('path');
const fs = require('fs');
const remove = require('remove');

/**
 * Read synchronically the file associated to this file directory and the relative path.
 * @param {string} relPath
 */
function readFile(relPath) {
  return fs.readFileSync(path.join(__dirname, relPath), { encoding: 'utf-8' });
}

/**
 * Read synchronically the file associated to the path parameter.
 * @param {string} relPath path string, any.
 */
function readFileRelPath(relPath) {
  return fs.readFileSync(relPath, { encoding: 'utf-8' });
}

/**
 * Standard error function.
 * @param {*} err error code
 */
function errorCode(err) {
  console.log('Process failed, exited with', err);
}

/**
 * Read recursively on dirname and apply functions depending on what kind of elements is found.
 * Asynchronous.
 * @param {string} dirname directory to read
 * @param {function} onFile function to do on file
 * @param {function} onDir function to do on dir
 * @param {function} onError function to do on error
 */
function readFilesRecursive(dirname, onFile, onDir, onError = errorCode) {
  fs.readdir(dirname, (err, filenames) => {
    if (err) {
      onError(err);
      return;
    }
    if (!filenames.length) { return; }
    filenames.forEach((filename) => {
      if (fs.statSync(dirname + filename).isDirectory()) {
        onDir(filename);
        readFilesRecursive(`${dirname}${filename}/`, onFile, onDir);
      } else {
        const file = fs.readFileSync(path.join(dirname, filename), {
          encoding: 'utf-8',
        });
        onFile(filename, file, dirname);
      }
    });
  });
}

/**
 * Read recursively on dirname and apply functions depending on what kind of elements is found.
 * Synchronous.
 * @param {string} dirname directory to read
 * @param {function} onFile function to do on file
 * @param {function} onDir function to do on dir
 * @param {function} onError function to do on error
 */
function readFilesRecursiveSync(dirname, onFile, onDir, onError = errorCode) {
  const files = fs.readdirSync(dirname);
  if (!files.length) return; // exit condition

  files.forEach((filename) => { // recursive
    if (fs.statSync(dirname + filename).isDirectory()) { // if is dir
      onDir(filename); // apply function
      readFilesRecursiveSync(`${dirname}${filename}/`, onFile, onDir); // call the function with it's childs
    } else { // if not, and by how this is implemented, it is a file:
      const file = fs.readFileSync(path.join(dirname, filename), {
        encoding: 'utf-8',
      }); // read the file
      onFile(filename, file, dirname); // apply the function to the file
    }
  });
}

/**
 * Open a directory and read it's inner files. On each file
 * the method will then use the onFileContent parameter to fulfill
 * an action depending on the file.
 *
 * @param {*} dirname Directory to be read.
 * @param {*} onFileContent Function to be done to a file.
 * @param {*} onError What to do in case of error.
 */
function readFiles(dirname, onFileContent, onError = errorCode) {
  fs.readdir(dirname, (err, filenames) => {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach((filename) => {
      const file = fs.readFileSync(path.join(dirname, filename), {
        encoding: 'utf-8',
      });
      onFileContent(filename, file);
    });
  });
}

/**
 * Write a file over a given path.
 * @param {*} writePath Path of the file to be written.
 * @param {*} name Name of the file to be written.
 * @param {*} content Content of the file.
 */
function writeFile(writePath, name, content) {
  const exp = name === '' ? writePath : (writePath + name);
  fs.writeFileSync(exp, content, (err) => {
    errorCode(err);
  });
}

/**
 * Creates a directory. If the directory parameter is false (default), creates the root directory.
 * Otherwise, creates a directory relative to the root one.
 *
 * @param {*} root Root path for the directory to be started on
 * @param {*} directory path to the directory to be created (if it is actually set to some value)
 */
function createDirectory(root, directory = false) {
  let buildDir = root;
  if (directory === false) {
    if (fs.existsSync(buildDir)) {
      remove.removeSync(buildDir, (err) => {
        console.log(`Failed creating directory, error no. ${err}`);
      });
    }
  } else {
    buildDir = path.join(root, directory);
  }
  fs.mkdirSync(buildDir);
}

module.exports = {
  createDirectory,
  writeFile,
  readFiles,
  readFile,
  readFilesRecursive,
  readFilesRecursiveSync,
  readFileRelPath,
};
