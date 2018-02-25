var path = require("path");
var fs = require("fs");
var remove = require("remove");

function readFile(relPath) {
  return fs.readFileSync(path.join(__dirname, relPath), { encoding: "utf-8" });
}

function errorCode(err) {
  console.log("Process failed, exited with", err);
  return;
}

/**
 * 
 * @param {string} dirname 
 * @param {function} onFile 
 * @param {function} onDir 
 * @param {function}[input=errorCode]onError  
 */
function readFilesRecursive(dirname, onFile, onDir, onError = errorCode) {
  fs.readdir(dirname, (err, filenames) => {
    if (err) {
      onError(err);
      return
    }
    if (!filenames.length) {
      return
    } else {
      filenames.forEach(filename => {
        if (fs.statSync(dirname + filename).isDirectory()) {
          onDir(filename)
          readFilesRecursive(`${dirname}${filename}/`, onFile, onDir)
        } else {
          let file = fs.readFileSync(path.join(dirname, filename), {
            encoding: "utf-8"
          });
          onFile(filename, file, dirname);
        }
      });
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
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(filename => {
      let file = fs.readFileSync(path.join(dirname, filename), {
        encoding: "utf-8"
      });
      onFileContent(filename, file);
    });
  });
}

/**
 * Write a file over a given path.
 * @param {*} path Path of the file to be written.
 * @param {*} name Name of the file to be written.
 * @param {*} content Content of the file.
 */
function writeFile(path, name, content) {
  fs.writeFileSync(path + name, content, err => {
    errorCode(err);
  });
}

/**
 * Creates a directory. If the directory parameter is false (default), creates the root directory.
 * Otherwise, creates a directory relative to the root one.
 *
 * @param {*} root Root path for the directory to be started on
 * @param {*} directory relative path to the directory to be created (if it is actually set to some value)
 */
function createDirectory(root, directory = false) {
  var build_dir = root;
  if (directory === false) {
    if (fs.existsSync(build_dir)) {
      remove.removeSync(build_dir, err => {
        console.log(`Failed creating directory, error no. ${err}`);
      });
    }
  } else {
    build_dir = path.join(root, directory);
  }
  fs.mkdirSync(build_dir);
}

module.exports = {
  createDirectory: createDirectory,
  writeFile: writeFile,
  readFiles: readFiles,
  readFile: readFile,
  readFilesRecursive: readFilesRecursive
};
