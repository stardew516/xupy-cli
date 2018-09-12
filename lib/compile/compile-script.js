'use strict';

var fs = require('fs');
var path = require('path');
var util = require('../utils/util');
var projectPath = process.cwd();

exports = module.exports = function (filePath, code) {
  var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
  var relativePath = util.getRelativePath(filePath);
  var newPath = relativePath.replace('.xu', '.js');
  if (filePath.indexOf('.xu') > 0) {
    var ss = util.babelJs(code, filename);
    var json = util.getConfig(ss.code);
    var jsonPath = relativePath.replace('.xu', '.json');
    var typeData = util.getTypeUrl(filePath);
    util.getModuleName(ss.code, typeData.type).then(function (res) {
      var env = process.env.NODE_ENV;
      if (env === 'production') {
        var result = util.upjs(res);
        var jsCode = result.code;
        var newJson = util.trim(json);
        util.writeFile(path.resolve(projectPath, newPath), jsCode);
        util.log(' [写入js文件]'.green + ' ' + 'dist' + newPath);
        util.writeFile(path.resolve(projectPath, jsonPath), newJson);
        util.log(' [写入json文件]'.green + ' ' + 'dist' + jsonPath);
      } else {
        var _json = util.getConfig(ss.code);
        util.writeFile(path.resolve(projectPath, newPath), res);
        util.log(' [写入js文件]'.green + ' ' + 'dist' + newPath);
        util.writeFile(path.resolve(projectPath, jsonPath), _json);
        util.log(' [写入json文件]'.green + ' ' + 'dist' + jsonPath);
      }
    });
  } else {
    var jsCode = util.getJsContent(filePath);
    util.writeFile(path.resolve(projectPath, relativePath), jsCode);
    util.log(' [写入js文件]'.green + ' ' + 'dist' + newPath);
  }
};