const fm = require('front-matter');
const path = require('path');
const {
  createDirectory,
  writeFile,
  readFilesRecursiveSync,
  readFileRelPath,
} = require('../../helpers/io');
const pathParse = require('path').parse;
const { config } = require('../../helpers/loadConfig');
const { loadPlugins } = require('../../helpers/pluginLoader');
const copydir = require('copy-dir').sync;
const { existsSync } = require('fs');


const pathSrc = path.join(process.cwd(), '/'); // path.join(cwd, '/src/'); // Common path based on file location:
const pathSrcLength = pathSrc.length;

const buildDir = path.join(pathSrc, 'build');// './build';

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
function getContents(file, filename, dir, arr) {
  const { attributes } = fm(file);
  const name = `${dir.slice(pathSrcLength - 1) + pathParse(filename).name}.html`;
  attributes.name = name;
  arr.push(Object.assign({}, attributes));
}

function loadIndex() {
  const fileArray = [];
  readFilesRecursiveSync(
    `${pathSrc}contents/`,
    (filename, file, d) => getContents(file, filename, d, fileArray),
    () => {},
  );
  const index = readFileRelPath(`${pathSrc}${config.entry}`);
  const file = fm(index);
  const { attributes } = file;
  const render = require(`${pathSrc}plugins/${attributes.plugin}`).callback; // get the callback to render the html
  writeFile(
    `${buildDir}/`,
    config.entry, // filename to be exported
    render(file.body, Object.assign({}, attributes, { pages: fileArray })), // render the html
  );
}

function loadFileTree() {
  readFilesRecursiveSync(
    `${pathSrc}contents/`,
    (filename, file, d) => parse(file, filename, d),
    name => createDirectory(`${buildDir}/contents`, name),
  );
}

function loadStyles() {
  function applyPlugins(file, fname) {
    let css = file;
    loadPlugins('style').forEach((callback) => {
      css = callback(css, fname);
    });
    const cssName = path.parse(fname).name;
    if (cssName.slice(0, 1) !== '_') {
      writeFile(`${pathSrc}build/style/`, `${cssName}.css`, css);
    }
  }
  readFilesRecursiveSync(
    `${pathSrc}style/`,
    (filename, file, dir) => {
      applyPlugins(file, filename);
    },
    () => {},
  );
  if (existsSync(`${pathSrc}images`)) {
    copydir(`${pathSrc}images`, `${pathSrc}build/images/`);
  }
}

function loadContent() {
  loadStyles();
  loadFileTree();
  loadIndex();
}

/**
 * Builds the project structure.
 */

function build() {
  createDirectory(buildDir);
  createDirectory(buildDir, './style');
  createDirectory(buildDir, './images');
  createDirectory(buildDir, './contents');
  loadContent();
}

// return the build function, which when called will generate a build directory on the project root,
// and then add all files correctly compiled and placed into their directories.
module.exports = { build };
