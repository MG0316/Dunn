const handlebars = require("handlebars")

module.exports.callback = (layout, attributes) => {
    return handlebars.compile(layout)(attributes)
}