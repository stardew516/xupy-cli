'use strict';

var fs = require('fs');
var path = require('path');
var babel = require('babel-core');
var stage1 = require('babel-preset-stage-1');
var es2015 = require('babel-preset-es2015');
var DOMParser = require('xmldom').DOMParser;
var uglifyjs = require("uglify-js");
var less = require('less');
var minCss = require('cssmin');
var colors = require("colors");
var sh = require('shelljs');
var projectPath = process.cwd();
var srcPath = path.resolve(projectPath, 'src');
var distPath = path.resolve(projectPath, 'dist');

module.exports = {
  getScriptContent: function getScriptContent(content, filePath) {
    var code = '';
    var doc = new DOMParser().parseFromString(content);
    [].slice.call(doc.childNodes || []).forEach(function (child) {
      var nodeName = child.nodeName;
      if (nodeName === 'script' && child.hasAttribute('src')) {
        var _srcPath = path.resolve(path.dirname(filePath), child.getAttribute('src'));
        code = fs.readFileSync(_srcPath, { encoding: 'utf8' });
      } else if (nodeName === 'script') {
        [].slice.call(child.childNodes || []).forEach(function (c) {
          code += c.toString();
        });
      }
    });
    return code;
  },
  getWxml: function getWxml(content) {
    var code = '';
    var doc = new DOMParser().parseFromString(content);
    [].slice.call(doc.childNodes || []).forEach(function (child) {
      var nodeName = child.nodeName;
      if (nodeName === 'template') {
        [].slice.call(child.childNodes || []).forEach(function (c) {
          code += c.toString();
        });
      }
    });
    return code;
  },
  getStyle: function getStyle(content, filePath) {
    var code = '';
    var env = process.env.NODE_ENV;
    var doc = new DOMParser().parseFromString(content);
    [].slice.call(doc.childNodes || []).forEach(function (child) {
      var nodeName = child.nodeName;
      if (nodeName === 'style' && child.hasAttribute('src')) {
        var importSrc = '@import "' + child.getAttribute('src').replace('.less', '.wxss') + '";';
        code += importSrc;
      } else if (nodeName === 'style') {
        [].slice.call(child.childNodes || []).forEach(function (c) {
          code += c.toString();
        });
      }
    });
    if (env === 'production') {
      code = minCss(code);
    }
    return code;
  },
  getJsContent: function getJsContent(filePath) {
    var code = '';
    var env = process.env.NODE_ENV;
    var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
    var newCode = fs.readFileSync(filePath, { encoding: 'utf8' });
    var codeObj = this.babelJs(newCode, filename);
    code = codeObj.code;
    if (env === 'production') {
      code = this.upjs(codeObj.code).code;
    }
    return code;
  },
  compileStyle: function compileStyle(filePath, type) {
    var code = '';
    var env = process.env.NODE_ENV;
    var newCode = fs.readFileSync(filePath, { encoding: 'utf8' });
    switch (type) {
      case 'less':
        less.render(newCode, function (err, res) {
          if (err) {
            throw err;
          }
          code = res.css.toString();
        });
        break;
    }
    if (env === 'production') {
      code = minCss(code);
    }
    return code;
  },
  babelJs: function babelJs(code, filename) {
    if (code) {
      return babel.transform(code, {
        filename: filename,
        presets: [es2015, stage1]
      });
    }
  },
  getTypeUrl: function getTypeUrl(filePath) {
    var dir = filePath.replace(path.resolve(process.cwd(), 'src'), '');
    var obj = {
      type: 'app',
      path: '/'
    };
    if (dir.indexOf('/pages') === 0) {
      obj.type = 'page';
    } else if (dir.indexOf('/components') === 0) {
      obj.type = 'component';
    } else if (dir.indexOf('/app.xu') === 0) {
      obj.type = 'app';
    }
    return obj;
  },
  getRelativePath: function getRelativePath(filePath) {
    return filePath.replace(srcPath, '');
  },
  getConfig: function getConfig(code) {
    var env = process.env.NODE_ENV;
    var filterStr = '.config = ';
    var str = findstr(code, filterStr);
    return str.replace(filterStr, '');
  },
  getModuleName: function getModuleName(code, type) {
    if (code !== 'undefined') {
      return new Promise(function (resolve, reject) {
        var newStr = code.match(/require(.*)xupy\/index['"]\)/ig)[0];
        code = code.replace(/exports\.default\s*=\s*(\w+);/ig, function (m, defaultExport) {
          if (defaultExport === 'undefined') {
            return '';
          }
          var rtCode = '';
          if (type === 'page') {
            rtCode = '\nPage(' + newStr + '.default.$createPage(' + defaultExport + '));\n';
          } else if (type === 'app') {
            rtCode = '\nApp(' + newStr + '.default.$createApp(' + defaultExport + '));\n';
          } else if (type === 'component') {
            rtCode = '\nComponent(' + newStr + '.default.$createComponent(' + defaultExport + '));\n';
          }
          return rtCode;
        });
        resolve(code);
      });
    }
  },
  writeFile: function writeFile(filePath, content) {
    var newPath = path.resolve(process.cwd(), 'dist' + filePath);
    var pathArr = newPath.split('/');
    var lastPath = '/' + pathArr[pathArr.length - 1];
    var tPath = newPath.replace(lastPath, '');
    var newSta = fs.existsSync(tPath);
    if (newSta) {
      fs.writeFileSync(newPath, content);
    } else {
      this.mkdirsSync(tPath).then(function (res) {
        fs.writeFileSync(newPath, content);
      });
    }
  },
  mkdirsSync: function mkdirsSync(dirname) {
    var _this = this;

    return new Promise(function (resolve, reject) {
      if (fs.existsSync(dirname)) {
        resolve(true);
      } else {
        if (_this.mkdirsSync(path.dirname(dirname))) {
          fs.mkdirSync(dirname);
          resolve(true);
        }
      }
    });
  },
  createDir: function createDir(dirPath) {
    return new Promise(function (resolve, reject) {
      dirPath = path.resolve(process.cwd(), 'dist' + dirPath);
      var status = fs.existsSync(distPath);
      if (!status) {
        fs.mkdirSync(dirPath);
      }
      resolve();
    });
  },
  upjs: function upjs(code) {
    return uglifyjs.minify(code);
  },
  trim: function trim(code) {
    return code.replace(/\s+/g, "").replace(/[\r\n]/g, "");
  },
  log: function log(content) {
    var time = this.getTime();
    console.log(time.grey + content);
  },
  getTime: function getTime() {
    var date = new Date();
    return '[' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ']';
  },
  delDir: function delDir(filePath, type) {
    var _this2 = this;

    var relativePath = this.getRelativePath(filePath);
    var dirPath = path.resolve(process.cwd(), 'dist' + relativePath);
    if (type) {
      var command = 'rm -rf ' + dirPath;
      sh.exec(command, function () {
        _this2.log(' [删除文件夹]'.red + ' ' + 'dist' + relativePath);
      });
    } else {
      var pathArr = dirPath.split('/');
      var fileName = pathArr[pathArr.length - 1];
      var newPath = dirPath.replace(fileName, '');
      var fileReg = fileName.split('.')[0] + '.*';
      var _command = 'rm ' + newPath + fileReg;
      sh.exec(_command, function () {
        if (relativePath.indexOf('.xu')) {
          ['json', 'js', 'wxml', 'wxss'].forEach(function (r) {
            _this2.log(' [删除文件]'.red + ' ' + 'dist' + relativePath.replace('.xu', '.' + r));
          });
        } else {
          _this2.log(' [删除文件]'.red + ' ' + 'dist' + relativePath);
        }
      });
    }
  },
  doCopy: function doCopy() {
    var _this3 = this;

    var xuiPath = path.join(__dirname, '../../xupy/dist');
    var newPath = path.join(projectPath, './dist/xupy');
    fs.exists(newPath, function (res) {
      if (!res) {
        var command = 'cp -r ' + xuiPath + ' ' + newPath;
        sh.exec(command, function () {
          _this3.log('拷贝依赖文件'.green);
        });
      }
    });
  }
};

function find_r(str, str_index) {
  var l_d = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '{';
  var r_d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '}';

  var _stack = [];
  for (i = str_index, len = str.length; i < len; i++) {
    var _char = str.charAt(i);
    if (l_d == _char) {
      _stack.push(i);
    } else if (r_d == _char) {
      _stack.pop();
      if (!_stack.length) {
        return i + 1;
      }
    } else {
      continue;
    }
  }
  return str_index;
}
function findstr(str, fd) {
  var l = str.indexOf(fd);
  var r = 0;
  if (-1 === l) {
    return '';
  } else {
    r = find_r(str, l);
    return str.substring(l, r);
  }
}