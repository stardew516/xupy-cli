'use strict';

var clone = require('git-clone');
var program = require('commander');
var shell = require('shelljs');
var log = require('tracer').colorConsole();

process.title = 'xupy';

program.version('1.1.0').description('xupy模板工程cli');

program.version(require('../package').version, '-v, --version').usage('<command> [options]').command('init', 'init <templete> <project>').command('build', 'xupy build');

program.command('init <tpl> <project>').action(require('./xupy-init'));

program.command('build').action(require('./xupy-build')).option('-f, --file <file>', '待编译xu文件').option('-s, --source <source>', '源码目录').option('-t, --target <target>', '生成代码目录').option('-o, --output <type>', '编译类型：web，weapp。默认为weapp').option('-p, --platform <type>', '编译平台：browser, wechat，qq。默认为browser').option('-w, --watch', '监听文件改动').option('--no-cache', '对于引用到的文件，即使无改动也会再次编译');
program.parse(process.argv);