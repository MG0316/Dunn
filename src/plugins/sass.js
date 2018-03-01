const nodeSass = require('node-sass');
const { parse } = require('path');

function compile(file, filename) {
  const fName = parse(filename);
  if (fName.ext === 'scss') {
    if (fName.name.slice(0, 2) === '__') {
      return '';
    }
  } else {
    return nodeSass.renderSync({ data: file }).css;
  }
}

module.exports.callback = (file, filename) => compile(file, filename);
