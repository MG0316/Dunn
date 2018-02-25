const ejs = require('ejs')

module.exports.callback = (layout, attributes) => {
    return ejs.render(layout, attributes)
}