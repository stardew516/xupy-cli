'use strict';

var fs = require('fs');
var path = require('path');
var util = require('../utils/util');
var projectPath = process.cwd();

exports = module.exports = function (filePath, code) {
  var relativePath = util.getRelativePath(filePath);
  if (filePath.indexOf('.xu') > 0) {
    var style = util.getStyle(code, filePath);
    var wxssPath = relativePath.replace('.xu', '.wxss');
    util.writeFile(path.resolve(projectPath, wxssPath), style || '');
    util.log(' [写入wxss文件]'.green + ' ' + 'dist' + wxssPath);
  } else if (filePath.indexOf('.less') > 0) {
    var _style = util.compileStyle(filePath, 'less');
    var _wxssPath = relativePath.replace('.less', '.wxss');
    util.writeFile(path.resolve(projectPath, _wxssPath), _style || '');
    util.log(' [写入wxss文件]'.green + ' ' + 'dist' + _wxssPath);
  }
};