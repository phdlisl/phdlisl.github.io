# Gitbook的插件配置

npm为Gitbook提供了很多插件，只需要在Gitbook项目配置npm项目，就可以下载相关插件使用。

> [!NOTE]
> 插件应该在项目目录下安装，也就是说在当前项目文件下安装，才会出现在`package.json`文件中。

## 搜索插件：gitbook-plugin-search-pro

## 代码插件：gitbook-plugin-code

## 主题插件：gitbook-plugin-theme-

## 隐藏Gitbook默认设置：gitbook-plugin-hide-element

Gitbook页面有诸如“Published with GitBook”的默认设置，可用这个插件使之隐藏。

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

## 添加提示、警告等提示框：gitbook-plugin-flexible-alerts

插件gitbook-plugin-flexible-alerts的[官方文档](https://www.npmjs.com/package/gitbook-plugin-flexible-alerts)，首先在项目中安装该插件


```
npm i gitbook-plugin-flexible-alerts
```

然后在book.js文件中添加配置项，以下是其中一种配置方式，更多配置参数，可查看[官方文档](https://www.npmjs.com/package/gitbook-plugin-flexible-alerts)。


```
{
  "plugins": [
    "flexible-alerts"
  ],
  "pluginsConfig": {
    "flexible-alerts": {
      "style": "flat"
    }
  }
}
```

使用方式如下，`> [!NOTE]`给出“提示”，后面跟着相关文本；其他提示框也类似，例如下面的“TIPs”。


```
> [!NOTE]
> 文本
```
> [!TIP]
> An alert of type 'tip' using alert specific style 'flat' which overrides global style 'callout'.
> In addition, this alert uses an own heading and hides specific icon.

## 菜单折叠：gitbook-plugin-expandable-chapters

## 返回顶部：gitbook-plugin-back-to-top-button


## TeX 公式：gitbook-plugin-katex

插件gitbook-plugin-katex的[官方文档](https://www.npmjs.com/package/gitbook-plugin-katex)，首先在项目中安装该插件。

```
npm i gitbook-plugin-katex
```

然后在book.js文件中添加配置项，以下是其中一种配置方式，更多配置参数，可查看[官方文档](https://www.npmjs.com/package/gitbook-plugin-katex)。

```
{
    "plugins": ["katex"]
}
```

例如，下面的代码，放在两个\$\$之间，与latex的语法格式相同，编译之后就是latex公式。

```
\int_{-\infty}^\infty g(x) dx 
\int_{-\infty}^\infty g(x) dx
```

Inline math: $$\int_{-\infty}^\infty g(x) dx$$

Block math:

$$
\int_{-\infty}^\infty g(x) dx
$$

\$\$在gitbook中有特殊含义，表示数学公式的开始，要打印\$\$，可以用转义的方式，如`\$\$`。

## 代码高亮：gitbook-plugin-prism

插件npm i gitbook-plugin-prism的[官方文档](https://www.npmjs.com/package/gitbook-plugin-prism)，首先在项目中安装该插件。

```
npm i gitbook-plugin-prism
```

然后在book.js文件中添加配置项，以下是其中一种配置方式，更多配置参数，可查看[官方文档](https://www.npmjs.com/package/gitbook-plugin-prism)。


```json
{
  "plugins": ["prism", "-highlight"]
}

"pluginsConfig": {
    "prism": {
      "css": ["prismjs/themes/prism-solarizedlight.css"],
      "lang": {"flow": "typescript"},
      "ignore": ["mermaid","eval-js"]
    },
}
```

在使用的时候，需要指定编程语言，例如上面采用的是json。