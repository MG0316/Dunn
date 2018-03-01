const { readFilesRecursiveSync } = require('./io');
const { loadPlugins } = require('./pluginLoader');
const fm = require('front-matter');

/**
 * Given a directory path, the function scans for the files within the dir and
 * returns an array containing the path to every file as a key, and the value is
 * the callback(s) function(s) to be applied to each element in the location the
 * key tells.
 *
 * @param {*} dirname
 * @param {*} whichPlugins
 * @return {array} Returns an array.
 */
function pathAndRender(dirname, whichPlugins) {
  let filesAndCallbacks = [];
  let content = loadPlugins(whichPlugins);
  readFilesRecursiveSync(dirname, (filename, file, dir) => {
    const plugins = fm(file).attributes.plugin;
    filesAndCallbacks[`${dir}${filename}`] = content[plugins];
  }, () => {});
}

module.exports.pathAndRender = (d, wP) => pathAndRender(d, wP);

// //first read all
// let body = fm(file).body; //get the file body
// let attr = fm(file).attributes; //get the rest of the attributes, i.e. template, title, etc..
// let layout = fm(readFile(`../../src/templates/${attr.template}`)); //get the right template for the post
// //then:

// let html = require(`../../src/plugins/${attr.plugin}`).callback(body); //apply the callback and render the markdown
// let render = require(`../../src/plugins/${layout.attributes.plugin}`)
//   .callback; //get the callback to render the html

// //then, export:
// // console.log("/"+filename+".html")
// createRoute(
//   "/asd",
//   render(layout.body, { title: attr.title, content: html })
// );
