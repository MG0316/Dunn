const nodeSass = require('node-sass');
const { parse } = require('path');

/**
 * Process a .scss file.
 *
 * @param {string} file read file
 * @param {string} filename name of the file
 */
function compile(file, filename) {
  const fName = parse(filename);
  if (fName.ext === '.scss') {
    if (fName.name.slice(0, 1) !== '_') { // checks if it is a valid .scss file to be compiled
      return nodeSass.renderSync({ data: file, includePaths: [`${process.cwd()}/style/`] })
        .css; // render the sass and return the css
    }
  }
  return file;
}

module.exports.callback = (file, filename) => compile(file, filename);
