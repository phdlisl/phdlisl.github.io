# 第一个Gitbook项目

在完成了[Gitbook环境配置](/ebook/startbook.md)之后，就可以创建任何Gitbook项目，现在做一个Gitbook项目的一般化结构框架。

1、选择项目存储位置，在该位置创建一个新的文件夹。

```
% mkdir foldername
```

2、在该目录下初始化一个Gitbook项目。

```
% gitbook init
warn: no summary file in this book 
info: create README.md 
info: create SUMMARY.md 
info: initialization is finished
```

完成后，文件目录下出现`README.md`、`SUMMARY.md`两个项目文件。当需要多个文件时，只有在`SUMMARY.md`中注册的文件才能够编译成HTML文件，才能够被访问。`README.md`文件是默认的文件，一定会被编译为HTML文件。

3、添加必要的文件。

```
% touch book.js
% touch .bookignore
```

其中`book.js`暂时放入下面的内容。

```
module.exports = {
  // 书籍信息
  title: 'Gitbook应用教程',
  description: 'Gitbook快速建立个人博客',
  author: '计算机科学实验室',
  lang: 'zh-cn',

  // 插件列表
  plugins: [ ],

  // 插件全局配置
  pluginsConfig: {
  },

  // 模板变量
  variables: {
    // 自定义
  },
};
```

其中	`.bookignore`暂时放入下面的内容。

```
package.json
package-lock.json
.bookignore
```

4、gitbook项目添加npm项目，方便项目管理。`npm init`初始化npm项目，一路回车即可，最后输入`yes`。

```
% npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help init` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (miracldoc) 
version: (1.0.0) 
description: 
entry point: (book.js) 
test command: 
git repository: 
keywords: 
author: 
license: (ISC) 
About to write to /Users/lisl/Documents/ehandlebook/miracldoc/package.json:

{
  "name": "miracldoc",
  "version": "1.0.0",
  "description": "",
  "main": "book.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}


Is this OK? (yes) yes
```

完成之后，将可以看到一个package.json的文件，文件内容如下。

```
{
  "name": "miracldoc",
  "version": "1.0.0",
  "description": "",
  "main": "book.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

修改文件中的配置信息，修改之后如下。

```
{
  "name": "miracldoc",
  "version": "1.0.0",
  "description": "",
  "main": "book.js",
  "scripts": {
    "serve": "gitbook serve",
    "build": "gitbook build"
  },
  "author": "",
  "license": "ISC"
}
```

其实就是将gitbook的启动命令和构建命令配置到了npm，由npm启动或构建项目。

5、启动或构建项目。

```
% npm run serve

> miracldoc@1.0.0 serve
> gitbook serve

Live reload server started on port: 35729
Press CTRL+C to quit ...

info: 7 plugins are installed 
info: loading plugin "livereload"... OK 
info: loading plugin "highlight"... OK 
info: loading plugin "search"... OK 
info: loading plugin "lunr"... OK 
info: loading plugin "sharing"... OK 
info: loading plugin "fontsettings"... OK 
info: loading plugin "theme-default"... OK 
info: found 1 pages 
info: found 0 asset files 
info: >> generation finished with success in 0.1s ! 

Starting server ...
Serving book on http://localhost:4000

```

启动项目之后，就可以在浏览器访问，地址为“http://localhost:4000”。

打包项目的命令与之类似。

```
% npm run build

> miracldoc@1.0.0 build
> gitbook build

info: 7 plugins are installed 
info: 6 explicitly listed 
info: loading plugin "highlight"... OK 
info: loading plugin "search"... OK 
info: loading plugin "lunr"... OK 
info: loading plugin "sharing"... OK 
info: loading plugin "fontsettings"... OK 
info: loading plugin "theme-default"... OK 
info: found 1 pages 
info: found 0 asset files 
info: >> generation finished with success in 0.1s ! 
```

这只是完成一个简单的项目创建，关于项目的初始设置可以阅读[操作技巧](/ebook/gitbk.md)。
