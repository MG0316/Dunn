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
  const filesAndCallbacks = [];
  const content = loadPlugins(whichPlugins);
  readFilesRecursiveSync(dirname, (filename, file, dir) => {
    const plugins = fm(file).attributes.plugin;
    filesAndCallbacks[`${dir}${filename}`] = content[plugins];
  }, () => {});
}

module.exports.pathAndRender = (d, wP) => pathAndRender(d, wP);

