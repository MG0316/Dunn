const handlebars = require('handlebars');

module.exports.callback = (layout, attributes) =>
  handlebars.compile(layout)(attributes);
