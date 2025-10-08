# Gitbook操作技巧

## 项目初始化配置

项目初始化完成之后，会带有很多Gitbook自身的默认配置，比如目录最后默认有一个“Published with GitBook”的超链接，在页面的右上角有很多页面分享图标。

### 去掉“Published with GitBook”超链接

插件gitbook-plugin-hide-element 的[官方文档](https://www.npmjs.com/package/gitbook-plugin-hide-element)，首先在项目中安装该插件


```
npm i gitbook-plugin-hide-element
```

然后在book.js文件中添加配置项

```
{
    "plugins": [
        "hide-element"
    ],
    "pluginsConfig": {
        "hide-element": {
            "elements": [".gitbook-link"]
        }
    }
}
```

完成上述配置，就可以将“Published with GitBook”的默认设置去掉。

### 去掉分享功能

在book.js中添加下面的json代码，不需要放在pluginsConfig中，与pluginsConfig同级。


```
// 去掉分享功能
"links": {
  "gitbook": false,
  "sharing": {
    "google": false,
    "facebook": false,
    "twitter": false,
    "all": false
  }
},
```

加入以上代码，即可去掉分享功能。


## 目录

### 目录分级

以分割线的方式为目录分级


### 目录编号

为页面左边的目录编号，在pluginsConfig中添加一个参数即可。注意，Gitbook的目录最多只有三层。


```
pluginsConfig: {
  // 目录编号
  "theme-default": { "showLevel": true },
},
```


## 项目结构

### SUMMAY.md

### README.md

### package.json



