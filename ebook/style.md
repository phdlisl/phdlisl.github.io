# 样式调整

可以在 GitBook 项目根目录创建`styles`文件夹，然后在其中创建`website.css`文件，调整默认的页面样式。

例如在`website.css`文件中添加如下代码，调整页面内容的展示宽度。

```
/* 调整主内容区域宽度 */
.book .book-body .page-wrapper .page-inner {
    max-width: 90% !important;
}

/* 调整正文内容宽度 */
.markdown-section {
    /* max-width: 1200px !important; */
    max-width: 90% !important;
    margin: 0 auto;
}

/* 调整代码块的宽度 */
.markdown-section pre {
    max-width: 100% !important;
}

/* 调整表格宽度 */
.markdown-section table {
    width: 100% !important;
}

/* 如果需要调整侧边栏宽度 */
.book .book-summary {
    width: 10% !important;
    /* width: 300px !important; */
}

.book.with-summary .book-body {
    /* left: 300px !important; */
    left: 10% !important;
}
```

同时需要在`book.js`文件中添加CSS 配置（如果没有这个配置，似乎也不会影响效果，应该是作为默认项加载）

```
{
    "styles": {
        "website": "styles/website.css"
    }
}
```