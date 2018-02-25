var { readFile } = require("./io");

function loadPlugins(prop) {//FIXME: RUTAS RUTAS RUTAS
  let config = JSON.parse(readFile("/../../src/dunn.config.json"));
  let plugins = config[prop].plugins;
  let callbacks = [];
  for (let i = 0; i < plugins.length; i++) {
    let { callback } = require(`../../src/${plugins[i]}`);
    callbacks[i] = callback;
  }
  return callbacks;
}
module.exports = {
  content: loadPlugins("content"),
  style: loadPlugins("style"),
  template: loadPlugins("template")
};
