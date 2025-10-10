# Gitbook环境配置

Gitbook基于Node.js开发，所以需要先配置Node.js的环境，然后配置Gitbook环境。本文形成时（2024年4月）选择的环境及版本如下：

1. 操作系统：MacOS M1 12.2
2. Node.js：18.20.2
3. npm：10.5.0
4. Gitbook：3.2.3

> [!NOTE]
> Node.js的版本选择不宜过高，可参考Gitbook的[官网说明](https://github.com/GitbookIO/gitbook)。



## 配置node.js环境

进入[node.js官网](https://nodejs.org/)，下载安装程序，这里建议选择`18.20.2LTS`版本，下载好安装程序就可以双击安装。

安装过程不需要有特殊设置和选择，直接选择【确定】下一步即可。

> [!NOTE]
> 根据操作系统不同，选择不同的版本，本文教程用的操作系统是MacOS M1 12.2。

完成安装之后，可查看安装是否成功。

```
% node -v
% which node
```

1. 第一个命令查看安装版本，如果能够输出版本信息，表示安装成功。
2. 第二个命令可查看安装路径。

## 配置Gitbook环境

> [!NOTE]
> Gitbook环境需要Nodejs支持，配置过程中，可能出现两个重要错误，都与nodejs版本相关。

在nodejs的配置中，已经默认配置了[npm](https://www.npmjs.com)，只需要用npm安装Gitbook即可。

```
% npm install -g gitbook-cli
```

这里可能就安装失败，提示错误信息如下

```
npm ERR!  [Error: EACCES: permission denied, mkdir
```

这个错误提示很简单，就是没有权限，只需要在命令前面加上`sudo`即可

```
% sudo npm install -g gitbook-cli
```

配置完成，即可查看版本信息，如果有正确版本信息，表示安装成功。

```
% gitbook --version
```

键入上述命令，将进入Gitbook相关包下载安装时间，只需要等待。但如果选择的nodejs版本过高，可能会出现下面的错误提示。

```
Installing GitBook 3.2.3
/usr/local/lib/node_modules/gitbook-cli/node_modules/npm/node_modules/graceful-fs/polyfills.js:287
      if (cb) cb.apply(this, arguments)
                 ^

TypeError: cb.apply is not a function
    at /usr/local/lib/node_modules/gitbook-cli/node_modules/npm/node_modules/graceful-fs/polyfills.js:287:18
    at FSReqCallback.oncomplete (node:fs:205:5)

Node.js v20.12.2
```

根据错误提示信息，找到`/usr/local/lib/node_modules/gitbook-cli/node_modules/npm/node_modules/graceful-fs/polyfills.js`文件，将下面三行代码注释掉，再次尝试即可顺利完成。

```
  // fs.stat = statFix(fs.stat)
  // fs.fstat = statFix(fs.fstat)
  // fs.lstat = statFix(fs.lstat)
```

> [!NOTE]
> 这个错误提示及解决办法，在后面的配置过程中，可能还会用到。

再次看出版本信息，将可以看到Gitbook版本信息。

```
% gitbook --version
CLI version: 2.3.2
GitBook version: 3.2.3
```



## 初始化Gitbook项目

完成上述过程之后，就可以初始化Gitbook项目。在磁盘新建文件夹，然后在该文件目录下初始化一个项目。

```
% pwd
/Documents/ehandlebook/ebook
% gitbook init
```

此时，可能出现如下错误提示。

```
TypeError [ERR_INVALID_ARG_TYPE]: The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received an instance of Promise
```

这是版本不兼容导致，下面有两个处理办法，本文采用第二个解决方案。

1、卸载nodejs，更换低版本。

先查看nodejs的安装路径，然后卸载掉已经安装的gitbook，然后将nodejs相关的文件删除。删除完nodejs之后，再次看出其版本信息，是找不到版本信息的。

```
% which node
/usr/local/bin/node

% sudo npm uninstall -g gitbook
% sudo npm uninstall -g gitbook-cli

% sudo rm -rf /usr/local/bin/npm
% sudo rm -rf /usr/local/share/man/man1/node.1 
% sudo rm -rf /usr/local/lib/dtrace/node.d
% sudo rm -rf /usr/local/lib/node_modules/...与node相关
% sudo rm -rf ~/.npm
% sudo rm -rf ~/.node-gyp
% sudo rm /usr/local/bin/node
```

完成卸载之后，重新下载低版本nodejs安装，安装过程与之前的一样。完成所有的环境配置之后，再次创建gitbook项目，可能还是会出现这个错误。

2、不卸载重装，进入gitbook安装文件，修改相关代码。

用gitbook的debug命令，找到下面版本文件。在版本文件下，找到`\3.2.3\lib\init.js`文件，将该文件的其中一行代码替换掉。

```
% gitbook init --debug
/Users/.../.gitbook/versions/3.2.3/
```

原代码行和替换的代码行

```
// return fs.writeFile(filePath, summary.toText(extension));
return summary.toText(extension).then(stx=>{return fs.writeFile(filePath, stx);});
```

完成之后，再次初始化项目，将可以正常创建。

```
% gitbook init
warn: no summary file in this book 
info: create SUMMARY.md 
info: initialization is finished 
```

## 测试

本文之初采用Sublime Text编辑器管理gitbook项目，它的弊端是不能实时更新网页内容，很多人推荐使用Typora。

为了方便对gitbook项目的管理，在gitbook项目中创建npm项目。在gitbook项目的文件目录下，创建npm项目。这里有很多选项，直接回车即可，最后选择`yes`。

```
% npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help init` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (ebook) 
version: (1.0.0) 
description: 
entry point: (index.js) 
test command: 
git repository: 
keywords: 
author: 
license: (ISC) 
About to write to /Documents/ehandlebook/ebook/package.json:

{
  "name": "ebook",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}


Is this OK? (yes) 
```

完成npm项目配置之后，项目中会得到一个`package.json`文件。

启动项目有两种方式，第一种方式是用gitbook的启动命令。还是在该项目目录下，启动项目。

```
% gitbook serve 
Live reload server started on port: 35729
Press CTRL+C to quit ...

/usr/local/lib/node_modules/gitbook-cli/node_modules/npm/node_modules/graceful-fs/polyfills.js:287
      if (cb) cb.apply(this, arguments)
                 ^

TypeError: cb.apply is not a function
    at /usr/local/lib/node_modules/gitbook-cli/node_modules/npm/node_modules/graceful-fs/polyfills.js:287:18
```

很遗憾，可能启动不成功，提示的错误，与前面出现的错误类型一致，找到`/usr/local/lib/node_modules/gitbook-cli/node_modules/npm/node_modules/graceful-fs/polyfills.js`文件，将下面三行代码注释掉，再次尝试即可顺利完成。

```
  // fs.stat = statFix(fs.stat)
  // fs.fstat = statFix(fs.fstat)
  // fs.lstat = statFix(fs.lstat)
```

再次启动，启动之后，会出现一个目录`_book`，浏览器访问“http://localhost:4000”。

```
> ebook@1.0.0 serve
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
info: found 1 asset files 
info: >> generation finished with success in 0.1s ! 

Starting server ...
Serving book on http://localhost:4000
```

第二种启动方式，在`package.json`中配置启动项。

```
{
  "name": "ebook",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "serve": "gitbook serve",
    "build": "gitbook build"
  },
  "author": "",
  "license": "ISC"
}
```

启动命令为 

```
% npm run serve
```

构建项目的命令为

```
% npm run build
```

gitbook依次读取.gitignore，.bookignore和.ignore文件，将一些文件和目录排除。创建.bookignore文件，在里面可以配置需要忽略的内容。

```
package.json
package-lock.json
.bookignore
```

构建项目

```
% npm run build

> ebook@1.0.0 build
> gitbook build

info: 9 plugins are installed 
info: 6 explicitly listed 
info: loading plugin "search-pro"... OK 
info: loading plugin "code"... OK 
info: loading plugin "highlight"... OK 
info: loading plugin "sharing"... OK 
info: loading plugin "fontsettings"... OK 
info: loading plugin "theme-default"... OK 
info: found 1 pages 
info: found 0 asset files 
info: >> generation finished with success in 0.1s ! 
```

## 编辑工具

本文之初采用Sublime Text编辑器管理gitbook项目，它的弊端是不能实时更新网页内容，很多人推荐使用[Typora](https://www.typoraio.cn)。
