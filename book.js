module.exports = {
  // 书籍信息
  title: '档案馆',
  description: '技术博客指南，教学视频，教学笔记',
  // isbn: '987',
  author: 'phdlisl',
  lang: 'zh-cn',

  // 插件列表
  plugins: [
    "-lunr", "-search", "search-pro", 
    "katex", 
    "code", 
    "hide-element", 
    "flexible-alerts", 
    "prism", 
    "-highlight", 
    "expandable-chapters", 
    // "page-toc", 
    "back-to-top-button", 
    "tbfed-pagefooter", 
    "anchor-navigation-ex",
  ],

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
    "theme-default": { "showLevel": false },
    // 代码高亮
    "prism": {
      "css": ["prismjs/themes/prism-solarizedlight.css"],
      "lang": {"flow": "typescript"},
      "ignore": ["mermaid","eval-js"]
    },
    // 菜单折叠
    "expandable-chapters":{},
    // 页内导航
    // "page-toc": {
    //   "selector": ".markdown-section h1, .markdown-section h2, .markdown-section h3",
    //   "position": "before-first",
    //   "showByDefault": true,
    // },
    // 底部版权信息
    "tbfed-pagefooter": {
      "copyright":"&copy <a href='https://github.com/phdlisl/phdlisl.github.io'>phdlisl</a>",
      "modify_label": "Update in ",
      "modify_format": "YYYY-MM-DD HH:mm:ss"
    },
    // 页内导航
    "anchor-navigation-ex":{
      "showLevel": true,
      "associatedWithSummary": true,
      "printLog": false,
      "multipleH1": false,
      "mode": "float", // pageTop or float
      "showGoTop":false,
      "float": {
          "floatIcon": "fa fa-navicon",
          "showLevelIcon": false,
          "level1Icon": "fa fa-hand-o-right",
          "level2Icon": "fa fa-hand-o-right",
          "level3Icon": "fa fa-hand-o-right"
      },
      "pageTop": {
          "showLevelIcon": false,
          "level1Icon": "fa fa-hand-o-right",
          "level2Icon": "fa fa-hand-o-right",
          "level3Icon": "fa fa-hand-o-right"
      }
    }
  },

  // 去掉内置分享功能
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