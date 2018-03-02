const { config } = require('../../helpers/loadConfig');
const { existsSync } = require('fs');

const pathSrc = `${process.cwd()}/`;

/**
 * If there are appliable plugins, then get them and loop over the plugin array. If there is a valid
 * build directory to which the plugin can be applied, then apply it.
 */
function deploy() {
  const { plugins } = config.deploy;
  if (plugins) {
    plugins.forEach((element) => {
      if (existsSync(`${pathSrc}build/`)) {
        require(`${pathSrc}plugins/${element.plugin}`).callback(Object.assign({}, element['plugin-opts'], { dir: `${pathSrc}build` }));
      } else {
        console.log('Sorry, the build directory does not exist. Create it with [-b].');
      }
    });
  }
}

module.exports = { deploy };
