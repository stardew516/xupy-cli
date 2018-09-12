'use strict';

var util = require('./utils/util');
var sh = require('shelljs');
var gitClone = require('git-clone');

exports = module.exports = function (tpl, project, program) {
  util.log('xui-cli支持以下模板：'.gray);
  util.log('使用例子：xui kui myproject'.gray);
  if (tpl && project) {
    var pwd = process.cwd();
    util.log(('\u6B63\u5728\u62C9\u53D6\u6A21\u677F\u4EE3\u7801\uFF0C\u4E0B\u8F7D\u4F4D\u7F6E\uFF1A' + pwd + '/' + project + '/ ...').blue);
    gitClone('https://github.com/chaunjie/' + tpl + '.git', pwd + ('/' + project), null, function () {
      sh.rm('-rf', pwd + ('/' + project + '/.git'));
      util.log('模板工程建立完成'.green);
    });
  } else {
    util.log('正确命令例子：xui kui myproject'.red);
  }
};