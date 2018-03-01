const CleanCSS = require('clean-css');


module.exports.callback = (file, fname) => {
  const options = { /* options */ };
  return (new CleanCSS(options).minify(file)).styles;
};

