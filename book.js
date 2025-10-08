module.exports = {
  // 书籍信息
  title: 'Gitbook应用教程',
  description: 'Gitbook快速建立个人博客',
  // isbn: '987',
  author: '计算机科学实验室',
  lang: 'zh-cn',

  // 插件列表
  plugins: ["-lunr", "-search", "search-pro", "katex", "code", "hide-element", "flexible-alerts", "prism", "-highlight", "expandable-chapters"],

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
    },
    // 目录编号
    "theme-default": { "showLevel": true },
    "prism": {
      "css": ["prismjs/themes/prism-solarizedlight.css"],
      "lang": {"flow": "typescript"},
      "ignore": ["mermaid","eval-js"]
    },
    "expandable-chapters":{},
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

  // 模板变量
  variables: {
    // 自定义
  },
};