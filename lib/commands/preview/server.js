const express = require('express');
const fm = require('front-matter');
const livereload = require('livereload');
const pathParse = require('path').parse;
const chalk = require('chalk');
const { config } = require('../../helpers/loadConfig');
const {
  readFilesRecursiveSync,
  readFileRelPath,
  writeFile,
} = require('../../helpers/io');
const { loadPlugins } = require('../../helpers/pluginLoader');
const path = require('path');

const pathSrc = `${process.cwd()}/`; // Common path based on file location:
const pathSrcLength = pathSrc.length;
const app = express();

/**
 *Reads the file, gets the callback functions for each file (being: markdown or template)
 * and apply them all together.
 *
 * @param {string} file
 * @param {string} filename
 * @param {string} dir
 */
function renderView(file, filename, dir) {
  // first read all
  const f = readFileRelPath(dir + filename); // read markdown file
  const { body } = fm(f); // get the markdown file body
  const { attributes } = fm(f); // get the rest of the attributes, i.e. template, title, etc..
  const layout = fm(readFileRelPath(`${pathSrc}templates/${attributes.template}`)); // get the right template for the post
  // then:
  const html = require(`${pathSrc}plugins/${attributes.plugin}`).callback(body); // apply the callback and render the markdown
  const render = require(`${pathSrc}plugins/${layout.attributes.plugin}`)
    .callback; // get the callback in charge of rendering the html
  // then, export:
  return render(layout.body, Object.assign({}, attributes, { content: html }));
}

/**
 * Set a route in the server with the specified parameters. Renders the view into that route.
 *
 * @param {string} file
 * @param {string} filename
 * @param {string} dir
 */
function setRoute(file, filename, dir) {
  const urlDir = `${dir.slice(pathSrcLength - 1) +
    pathParse(filename).name}.html`;
  app.get(urlDir, (req, res) => {
    res.send(renderView(file, filename, dir));
  });
}

/**
 *Loops over the file tree in the /contents directory and applies the setRoute function to all
 *files found in the loop.
 */
function loadFileTree() {
  readFilesRecursiveSync(
    `${pathSrc}contents/`,
    (fname, file, dir) => setRoute(file, fname, dir),
    () => {},
  );
}

/**
 * Get the content list and push it into the specified array.
 * @param {string} file
 * @param {string} filename
 * @param {string} dir
 * @param {array} arr
 */
function getContents(file, filename, dir, arr) {
  const { attributes } = fm(file);
  const name = `${dir.slice(pathSrcLength - 1) +
    pathParse(filename).name}.html`;
  attributes.name = name;
  arr.push(Object.assign({}, attributes));
}

/**
 * Loads the index route, being any route specified in the dunn.config.json file, it needs to be
 * rendered on the side.
 */
function loadIndex() {
  app.get(`/${config.entry}`, (req, res) => {
    const fileArray = [];
    readFilesRecursiveSync(
      `${pathSrc}contents/`,
      (filename, file, d) => getContents(file, filename, d, fileArray),
      () => {},
    );
    // let index = readFile(`${pathSrc}${config.entry}`);
    const index = readFileRelPath(`${pathSrc}${config.entry}`);
    const file = fm(index);
    const { attributes } = file;
    const render = require(`${pathSrc}plugins/${attributes.plugin}`).callback; // get the callback to render the html
    res.send(render(file.body, Object.assign({}, attributes, { pages: fileArray })));
  });
}

/**
 * Sets the livereload server up and configures to what paths to listen.
 */
function liveReload() {
  // Create a livereload server
  const reloadServer = livereload.createServer({
    exts: ['html', 'ejs', 'md', 'css', 'json'], // Reload on changes to these file extensions.
    debug: false, // Print debug info
  });

  reloadServer.watch([
    `${pathSrc}contents/`,
    `${pathSrc}templates/`,
    `${pathSrc}plugins/`,
    `${pathSrc}style/`,
    `${pathSrc}images/`,
    `${pathSrc}${config.entry}`,
  ]); // Folders to watch for file-changes.
}

/**
 *
 */
function loadStyles() {
  function applyPlugins(file, fname) {
    let css = file;
    loadPlugins('style').forEach((callback) => {
      css = callback(css, fname);
    });
    const cssName = path.parse(fname).name;
    if (cssName.slice(0, 1) !== '_') {
      writeFile(`${pathSrc}style/`, `${cssName}.css`, css);
    }
  }
  readFilesRecursiveSync(
    `${pathSrc}style/`,
    (filename, file, dir) => {
      applyPlugins(file, filename);
    },
    () => {},
  );
}

/**
 * Sets up the server: loading styles, routes, static paths, etc.
 */
function setUpServer() {
  liveReload();
  // set routes:
  loadFileTree();
  loadIndex();
  loadStyles();
  app.use('/style', express.static(`${pathSrc}style`));
  app.use('/images', express.static(`${pathSrc}images`));

  // at last, start listening
  const port = process.env.port || 3000;
  app.listen(port, () => {
    console.log(chalk.green(`Dev server up and running at http://localhost:${port}/${
      config.entry
    } , happy coding!`));
  });
}

// finally, export the functino that creates the server.
module.exports.setUpServer = setUpServer;
