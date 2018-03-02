const { config } = require('../../helpers/loadConfig');
const { existsSync } = require('fs');

const pathSrc = `${process.cwd()}/`;
function deploy() {
  const { plugins } = config.deploy;
  if (plugins) {
    plugins.forEach((element) => {
      if (existsSync(`${pathSrc}build/`)) {
        require(`${pathSrc}plugins/${element.plugin}`).callback(Object.assign({}, element['plugin-opts'], { dir: `${pathSrc}build` }));
      } else {
        console.log('Sorry, the build directory does not exist. Create it with [-p].');
      }
    });
  }
}

module.exports = { deploy };
