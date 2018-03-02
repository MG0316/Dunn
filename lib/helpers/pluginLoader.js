const { join } = require('path');
const { config } = require('./loadConfig');

const pathSrc = join(process.cwd(), '/'); // Common path based on file location

/**
 * Get the prop-element from the config file. Get and read each file and save the
 * respective callback into the array. Return a full array.
 * @param {string} prop
 * @return {array }callback array for each of the plugins.
 */
function loadPlugins(prop) {
  const { plugins } = config[prop];
  const callbacks = [];
  for (let i = 0; i < plugins.length; i += 1) {
    callbacks[i] = require(`${pathSrc}plugins/${plugins[i]}`).callback;
  }
  return callbacks;
}
module.exports = {
  loadPlugins: whichPlugins => loadPlugins(whichPlugins),
};
