'use strict';

var fs = require('fs');
var path = require('path');
var util = require('../utils/util');
var projectPath = process.cwd();

exports = module.exports = function (filePath, code) {
  var wxml = util.getWxml(code);
  var relativePath = util.getRelativePath(filePath);
  var wxmlPath = relativePath.replace('.xu', '.wxml');
  util.writeFile(path.resolve(projectPath, wxmlPath), wxml || '');
  util.log(' [写入wxml文件]'.green + ' ' + 'dist' + wxmlPath);
};