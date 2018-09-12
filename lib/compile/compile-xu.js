'use strict';

var fs = require('fs');
var path = require('path');
var util = require('../utils/util');
var compileJs = require('./compile-script');
var compileWxml = require('./compile-wxml');
var compileStyle = require('./compile-style');
var projectPath = process.cwd();
var srcPath = path.resolve(projectPath, 'src');
var distPath = path.resolve(projectPath, 'dist');

exports = module.exports = function (filePath) {
  var typeData = util.getTypeUrl(filePath);
  var code = fs.readFileSync(filePath, { encoding: 'utf8' });
  var script = util.getScriptContent(code, filePath);
  var relativePath = 'src' + util.getRelativePath(filePath);
  if (script) {
    util.log(' [解析js]'.blue + ' ' + relativePath);
    compileJs(filePath, script);
  }
  if (typeData.type != 'app') {
    util.log(' [解析wxml]'.blue + ' ' + relativePath);
    compileWxml(filePath, code);
  }
  util.log(' [解析style]'.blue + ' ' + relativePath);
  compileStyle(filePath, code);
};