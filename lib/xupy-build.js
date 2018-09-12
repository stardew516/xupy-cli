"use strict";var chokidar=require("chokidar"),path=require("path"),compile=require("./compile/compile"),util=require("./utils/util"),glob=require("glob"),srcPath=path.resolve(process.cwd(),"src");function doCompile(e){var i="src"+util.getRelativePath(e);0<=e.indexOf(".js")?(util.log(" [编译js文件]".blue+" "+i),compile.compileScript(e)):0<=e.indexOf(".xu")?(util.log(" [编译xu文件]".blue+" "+i),compile.compileXu(e)):0<=e.indexOf(".less")&&(util.log(" [编译less文件]".blue+" "+i),compile.compileStyle(e))}function doBuild(){process.env.NODE_ENV="production",glob.sync(srcPath+"/**/*.*").forEach(function(e){doCompile(e)})}exports=module.exports=function(e){process.env.NODE_ENV="development",console.log(process.cwd()),e.watch?chokidar.watch(srcPath).on("all",function(e,i){switch(e){case"unlinkDir":util.delDir(i,!0);break;case"unlink":util.delDir(i,!1);break;case"addDir":break;case"add":case"change":doCompile(i)}}):doBuild()};