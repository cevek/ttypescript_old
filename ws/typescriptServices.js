var pathName = process.argv[3].split('=')[1];
var path = require('path');
var dirName =  path.dirname(pathName) + '/';
var tsPath = dirName + '/../../typescript/lib/';
var process = require('process');
var ts = require(tsPath + 'typescriptServices');
require(dirName +'../rewriter')(ts);
module.exports = ts;
