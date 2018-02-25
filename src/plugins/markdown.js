//markdown parser

const showdown  = require('showdown')

module.exports.callback = content => {
    return new showdown.Converter().makeHtml(content)    
}    