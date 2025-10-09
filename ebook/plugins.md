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

例如给出具体的样式配置

```
"flexible-alerts": {
  // "style": "flat",
  "note": {"label" : "注意"},
  "tip": {"label" : "提示"},
  "warning": { "label": "warning" },
  "danger": { "label": "危险" }
}
```

使用方式如下，`> [!NOTE]`给出“提示”，后面跟着相关文本；其他提示框也类似，例如下面的“TIPs”。


```
> [!NOTE]
> 文本
```

> [!NOTE]
> An alert of type 'tip' using alert specific style 'flat' which overrides global style 'callout'.
> In addition, this alert uses an own heading and hides specific icon.

```
> [!TIP]
> An alert of type 'tip' using alert specific style 'flat' which overrides global style 'callout'.
> In addition, this alert uses an own heading and hides specific icon.
```

> [!TIP]
> An alert of type 'tip' using alert specific style 'flat' which overrides global style 'callout'.
> In addition, this alert uses an own heading and hides specific icon.

更多高级用法，参考[官方文档](https://www.npmjs.com/package/gitbook-plugin-flexible-alerts)。

## 菜单折叠：gitbook-plugin-expandable-chapters

## 返回顶部：gitbook-plugin-back-to-top-button

插件gitbook-plugin-back-to-top-button的[官方文档](https://www.npmjs.com/package/gitbook-plugin-back-to-top-button)，首先在项目中安装该插件。

```
npm i gitbook-plugin-back-to-top-button
```

然后在`book.js`文件中添加配置项，以下是其中一种配置方式，更多配置参数，可查看[官方文档](https://www.npmjs.com/package/gitbook-plugin-back-to-top-button)。

```
{
    "plugins" : [ "back-to-top-button" ]
}
```

设置返回顶部按钮你之后，可能因为原来默认的左右导航箭头影响，不能正常显示，去除左右导航箭头可以配置CSS样式。

```
/* 隐藏导航箭头 */
.navigation-next, .navigation-prev {
    display: none !important;
}

/* 或者更具体的选择器 */
button[data-testid="next-chapter-button"],
button[data-testid="previous-chapter-button"] {
    display: none !important;
}
```

## 页内导航：gitbook-plugin-page-toc

插件gitbook-plugin-page-toc的[官方文档](https://www.npmjs.com/package/gitbook-plugin-page-toc)，首先在项目中安装该插件。

```
npm i gitbook-plugin-page-toc
```

然后在`book.js`文件中添加配置项，以下是其中一种配置方式，更多配置参数，可查看[官方文档](https://www.npmjs.com/package/gitbook-plugin-page-toc)。

```
{
  "plugins": [ "page-toc" ],
  "pluginsConfig": {
    "page-toc": {
      "selector": ".markdown-section h1, .markdown-section h2, .markdown-section h3, .markdown-section h4",
      "position": "before-first",
      "showByDefault": true
    }
  }
}
```

默认情况下显示导航目录，如果设置为false，则会隐藏导航目录，但是显示不了打开导航的按钮。可以设置为false，在需要打开导航目录的markdown文档顶部添加以下代码，则该页面出现导航目录。

```
---
showToc: true
---
```

页面上可能会有一些元素遮挡导航目录，这时候可以通过下面的方式将导航目录浮动到页面顶层。

```
/* 重置所有可能的高 z-index 元素 */
.book .book-header,
.book .book-summary,
.book .book-body .navigation,
.markdown-section .code-toolbar {
    z-index: 100 !important;
}

/* 模态框和弹出层 */
.modal, .popup, .tooltip {
    z-index: 1000 !important;
}

/* 页面目录 - 最高优先级 */
.page-toc {
    z-index: 2147483647 !important; /* 接近最大整数值 */
    position: fixed !important;
    right: 20px !important;
    top: 80px !important;
    
    /* 创建新的层叠上下文 */
    transform: translate3d(0, 0, 0);
    isolation: isolate;
}

/* 确保在移动端也能正常显示 */
@media (max-width: 1240px) {
    .page-toc {
        z-index: 2147483647 !important;
        position: fixed !important;
        top: 60px !important;
        right: 10px !important;
        width: 250px !important;
    }
}
```


## TeX 公式：gitbook-plugin-katex

插件gitbook-plugin-katex的[官方文档](https://www.npmjs.com/package/gitbook-plugin-katex)，首先在项目中安装该插件。

```
npm i gitbook-plugin-katex
```

然后在`book.js`文件中添加配置项，以下是其中一种配置方式，更多配置参数，可查看[官方文档](https://www.npmjs.com/package/gitbook-plugin-katex)。

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