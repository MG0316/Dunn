var fs = require('fs');
var ejs = require('ejs');

function read(){
    var config = fs.readFileSync('../../src/dunn.config.json', 'utf-8');
    console.log(config);
    var contentTree = {
        config: this.config
    }
}
// var templateString = null;
// var templateString = fs.readFileSync('../../index.html', 'utf-8');


module.exports = {build: read()}