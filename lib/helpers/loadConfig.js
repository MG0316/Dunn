const { readFileRelPath } = require('./io');
const { join } = require('path');

const pathSrc = join(process.cwd(), '/'); // Common path based on file location

module.exports.config = JSON.parse(readFileRelPath(`${pathSrc}dunn.config.json`));

