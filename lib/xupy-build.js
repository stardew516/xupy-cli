'use strict';

var chokidar = require('chokidar');
var path = require('path');
var compile = require('./compile/compile');
var util = require('./utils/util');
var glob = require('glob');
var srcPath = path.resolve(process.cwd(), 'src');

exports = module.exports = function (program) {
  process.env.NODE_ENV = 'development';
  console.log(process.cwd());
  var watch = program.watch;
  if (watch) {
    chokidar.watch(srcPath).on('all', function (event, path) {
      switch (event) {
        case 'unlinkDir':
          util.delDir(path, true);
          break;
        case 'unlink':
          util.delDir(path, false);
          break;
        case 'addDir':
          break;
        case 'add':
          doCompile(path);
          break;
        case 'change':
          doCompile(path);
          break;
      }
    });
  } else {
    doBuild();
  }
};

function doCompile(filePath) {
  var relativePath = 'src' + util.getRelativePath(filePath);
  if (filePath.indexOf('.js') >= 0) {
    util.log(' [编译js文件]'.blue + ' ' + relativePath);
    compile.compileScript(filePath);
  } else if (filePath.indexOf('.xu') >= 0) {
    util.log(' [编译xu文件]'.blue + ' ' + relativePath);
    compile.compileXu(filePath);
  } else if (filePath.indexOf('.less') >= 0) {
    util.log(' [编译less文件]'.blue + ' ' + relativePath);
    compile.compileStyle(filePath);
  }
}

function doBuild() {
  process.env.NODE_ENV = 'production';
  var entryFiles = glob.sync(srcPath + '/**/*.*');
  entryFiles.forEach(function (f) {
    doCompile(f);
  });
  // util.doCopy()
}