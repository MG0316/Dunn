const ejs = require('ejs');

module.exports.callback = (layout, attributes) => ejs.render(layout, attributes, { root: `${process.cwd()}/src/` });

