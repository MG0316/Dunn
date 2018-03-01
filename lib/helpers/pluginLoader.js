const { join } = require('path');
const { config } = require('./loadConfig');

const pathSrc = join(process.cwd(), '/src/'); // Common path based on file location

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
