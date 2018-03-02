const fm = require('front-matter');
const path = require('path');
const {
  createDirectory,
  writeFile,
  readFilesRecursiveSync,
  readFileRelPath,
} = require('../../helpers/io'); // io includes
const pathParse = require('path').parse; // parse a path string
const { config } = require('../../helpers/loadConfig'); // get the global config
const { loadPlugins } = require('../../helpers/pluginLoader'); // load a plugin-callback array
const copydir = require('copy-dir').sync; // copy directory
const { existsSync } = require('fs'); // check if dir exists


const pathSrc = path.join(process.cwd(), '/'); // Common path based on file location:
const pathSrcLength = pathSrc.length;

const buildDir = path.join(pathSrc, 'build'); // Directory for the build to be saved

/**
 * Read front matter from both the markdown and template. Parses and compiles the markdown
 * and template into valid html.
 *
 * @param {string} file Read file.
 * @param {string} filename File name.
 * @param {string} dir Working directory.
 */
function parse(file, filename, dir) {
  // first read all
  const { body } = fm(file); // get the file body
  const { attributes } = fm(file); // get the rest of the attributes, i.e. template, title, etc..
  const layout = fm(readFileRelPath(`${pathSrc}templates/${attributes.template}`)); // get the right template for the post
  // then:

  const html = require(`${pathSrc}plugins/${attributes.plugin}`).callback(body); // apply the callback and render the markdown
  const render = require(`${pathSrc}plugins/${layout.attributes.plugin}`)
    .callback; // get the callback in charge of rendering the html

  // then, export:
  const name = `${dir.slice(pathSrcLength - 1) + pathParse(filename).name}.html`;
  writeFile(
    `${buildDir}${name}`, // dir to be exported, delete the ./src and add ./build
    '', // filename to be exported
    render(layout.body, Object.assign({}, attributes, { content: html })), // render the html
  );
}

/**
 * Gets all the pages in the directory to be loaded into the index. Used only in loadIndex()
 * @param {string} file Read file.
 * @param {string} filename File name.
 * @param {string} dir Working directory.
 * @param {array} arr Array for the pages to be pushed into.
 */
function getContents(file, filename, dir, arr) {
  const { attributes } = fm(file);
  const name = `${dir.slice(pathSrcLength - 1) + pathParse(filename).name}.html`;
  attributes.name = name;
  arr.push(Object.assign({}, attributes));
}

/**
 * Loads the index view with all it's content.
 */
function loadIndex() {
  const fileArray = [];
  readFilesRecursiveSync(
    `${pathSrc}contents/`,
    (filename, file, d) => getContents(file, filename, d, fileArray),
    () => {},
  );

  const index = readFileRelPath(`${pathSrc}${config.entry}`); // get the app's entry point
  const file = fm(index); // gets the front matter
  const { attributes } = file;
  const render = require(`${pathSrc}plugins/${attributes.plugin}`).callback; // get the callback to render the html
  writeFile(
    `${buildDir}/`,
    config.entry, // filename to be exported
    render(file.body, Object.assign({}, attributes, { pages: fileArray })), // render the html
  );
}

/**
 * Get all the contents in the file tree and exports it into the build directory
 */
function loadFileTree() {
  readFilesRecursiveSync(
    `${pathSrc}contents/`,
    (filename, file, d) => parse(file, filename, d),
    name => createDirectory(`${buildDir}/contents`, name),
  );
}

/**
 * Used to process and load the styles into the build dir.
 */
function loadStyles() {
  function applyPlugins(file, fname) {
    let css = file;
    loadPlugins('style').forEach((callback) => { // get the callbacks for each style plugin and loop
      css = callback(css, fname); // apply each plugin to the last result
    });
    const cssName = path.parse(fname).name; // name to be exported with
    if (cssName.slice(0, 1) !== '_') { // if it is not a partial
      writeFile(`${pathSrc}build/style/`, `${cssName}.css`, css);
    }
  }
  readFilesRecursiveSync( // read the files in /style and apply the applyPlugins()
  // method when found one.
    `${pathSrc}style/`,
    (filename, file, dir) => {
      applyPlugins(file, filename);
    },
    () => {},
  );
  if (existsSync(`${pathSrc}images`)) { // if there is an image folder, then copy
    copydir(`${pathSrc}images`, `${pathSrc}build/images/`);
  }
}

/**
 * Load styles, file tree and then the index.
 */
function loadContent() {
  loadStyles();
  loadFileTree();
  loadIndex();
}

/**
 * Builds the project structure.
 */

function build() {
  createDirectory(buildDir); // create all the directories in the build
  createDirectory(buildDir, './style');
  createDirectory(buildDir, './images');
  createDirectory(buildDir, './contents');
  loadContent();
}

// return the build function, which when called will generate a build directory on the project root,
// and then add all files correctly compiled and placed into their directories.
module.exports = { build };
