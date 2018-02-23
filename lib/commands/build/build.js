var fs = require("fs");
var ejs = require("ejs");
var path = require("path");
var remove = require("remove");

function loadLayouts() {
  return {};
}

function errorCode(err) {
  console.log("Read failed, process exited with", err);
  return;
}

function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
      fs.readFile(dirname + filename, "utf-8", function(err, content) {
        if (err) {
          onError(err);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
}

function loadStyles() {
  return {};
}

function read() {
  //FIXME: relative path to the ACTUAL file location
  var config = JSON.parse(bufferFile("/../../src/dunn.config.json"));

  console.log(config);
  //main object
  var contentTree = {
    config: this.config,
    layouts: loadLayouts(),
    styles: loadStyles()
  };
}

function bufferFile(relPath) {
  console.log(__dirname, relPath);
  return fs.readFileSync(path.join(__dirname, relPath));
}

/**
 * Creates a directory. If the directory parameter is false (default), creates the root directory.
 * Otherwise, creates a directory relative to the root one.
 *
 * @param {*} root Root path for the directory to be started
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

/**
 * Builds the project structure. 
 */
function build() {
  const build_dir = "./build";
  createDirectory(build_dir);
  createDirectory(build_dir, './css');
  createDirectory(build_dir, './content');
  // if(contentTree.config.style.sass){
  //     //if there is SASS, preprocess it..

  // }
}

//return the build function, which when called will generate a build directory on the project root,
//and then add all files correctly compiled and placed into their directories.
module.exports = { build: build };
