module.exports = {
  // 书籍信息
  title: '个人档案',
  description: '技术博客指南，教学视频，教学笔记',
  // isbn: '987',
  author: 'phdlisl',
  lang: 'zh-cn',

  // 插件列表
  plugins: ["-lunr", "-search", "search-pro", "katex", "code", "hide-element", "flexible-alerts", "prism", "-highlight", "expandable-chapters", "page-toc", "back-to-top-button"],

  // 插件全局配置
  pluginsConfig: {
    // 去除默认设置
    "hide-element": { 
      "elements": [".gitbook-link"], // 去掉“Published with GitBook”
    },
    // 警告、提示信息
    "flexible-alerts": {
      // "style": "flat",
      "note": {"label" : "注意"},
      "tip": {"label" : "提示"},
      "warning": { "label": "warning" },
      "danger": { "label": "危险" }
    },
    // 目录编号
    "theme-default": { "showLevel": true },
    "prism": {
      "css": ["prismjs/themes/prism-solarizedlight.css"],
      "lang": {"flow": "typescript"},
      "ignore": ["mermaid","eval-js"]
    },
    "expandable-chapters":{},
    "page-toc": {
      "selector": ".markdown-section h1, .markdown-section h2, .markdown-section h3",
      "position": "before-first",
      "showByDefault": true,
      "showToc": true
    }
  },

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

  "styles": {
    "website": "styles/website.css"
  },

  // 模板变量
  variables: {
    // 自定义
  },
};