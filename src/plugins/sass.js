const nodeSass = require('node-sass');
const { parse } = require('path');

function compile(file, filename) {
  const fName = parse(filename);
  if (fName.ext === '.scss') {
    if (fName.name.slice(0, 1) !== '_') {
      return nodeSass.renderSync({ data: file, includePaths: [`${process.cwd()}/style/`] })
        .css;
    }
  }
  return file;
}

module.exports.callback = (file, filename) => compile(file, filename);
