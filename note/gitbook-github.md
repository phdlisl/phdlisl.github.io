# 基于GitHub服务用Gitbook搭建免费个人网站

搭建个人免费网站，需要解决几个关键问题，第一个问题是做一个个人网站，用什么工具做个人网站？第二个问题是个人网站部署在哪里，最重要的是免费。

第一个问题，选择Gitbook设计网站，相对简单，只需要掌握简单的语法规则，文档全部用markdown来写，关于Gitbook设计网站的教程，参考[gitbook快速搭建第一个个人博客项目](https://mp.weixin.qq.com/s?__biz=MzIzODAxNjE1OQ==&mid=2247490968&idx=1&sn=847f6e3956a8fcda3487757343c099bb&scene=21&poc_token=HAd05mij5zN0-rxptkxrv8uT0NNCr49BeN4FzKR4)

第二个问题，哪里有免费的服务器可以部署个人网站？GitHub就提供了这样的服务，选择GitHub有几个优先：第一，免费，长期有效；第二，同步代码，代码备份。

本文将用Github部署个人网站，有两点要求，一是Gitbook项目源码私有（private），二是GitHub部署Gitbook打包的个人网站，必须公有（public）。

0、准备一个gitbook项目，关于gitbook项目的创建，参考[Gitbook配置教程，快速搭建个人博客，制作个人电子书、帮助（说明）文档](https://mp.weixin.qq.com/mp/wappoc_appmsgcaptcha?poc_token=HNd05mijAXGnMqIHcjzlDjtALvHnI4SdhXVkvLJR&target_url=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzIzODAxNjE1OQ%3D%3D%26mid%3D2247490965%26idx%3D1%26sn%3Dc0dd8163ed92190bfec0d387ea9afaae%26scene%3D21#wechat_redirect)和[gitbook快速搭建第一个个人博客项目](https://mp.weixin.qq.com/s?__biz=MzIzODAxNjE1OQ==&mid=2247490968&idx=1&sn=847f6e3956a8fcda3487757343c099bb&scene=21&poc_token=HAJ15mij64nDqq5uMNRK7o3fO1QzJ2YFQgNFIa26)

1、创建两个github仓库，一个私有仓库，一个公有仓库，公有仓库的名称必须是usename.github.io，其中usename就是GitHub的用户名。

2、将本地项目同步到私有仓库，关于私有仓库、公有仓库创建、同步等操作，参考[本地同步上传、下载、新建github项目，一步到位](https://mp.weixin.qq.com/s?__biz=MzIzODAxNjE1OQ==&mid=2247492689&idx=1&sn=94d7e0b2d38a648c83b8eec8390b0617&scene=21&poc_token=HB915mij9Nilp00xGaQRoH2KOZk3HLCCpLPQsBMA)，主要命令

```
git initgit remote add origin xxxx
git add .
git commit -m "message"
git push origin main
```

在输入上述命令之前，先做以下操作：

在Gitbook项目中，需要加载很多组件，在同步项目到github的时候，可以去除这些组件，只需要在gitbook项目中，创建一个新的文件“.gitignore”，然后在文件中加入

```
node_modules/
```

这样，在上传项目的时候，就不会把node_modules目录添加到github上。

在clone项目之后，就需要重新安装相关的模块，否则无法编译通过。需要安装的模块在book.js文件的plugins插件列表中查看，可以通过[插件官网](https://www.npmjs.com/package/package)查询对应的插件，并用对应的命令安装，例如

```
npm install package
```

参考[gitbook美化代码格式化排版，代码高亮设置](https://mp.weixin.qq.com/s?__biz=MzIzODAxNjE1OQ==&mid=2247490980&idx=1&sn=3c2640aacaf195da34a81e506b7485ce&scene=21&poc_token=HDt15mijLYD529sovxejTRVLUrX9feGGk3hDh1tq)

3、将本地gitbook编译好的项目上传到github，这时候只需要上传项目中_book文件夹里面的所有文件即可，github仓库也只能通过静态页面展示个人网站内容，非静态页面无法展示。

```
git remote add public xxxxx
git subtree push --prefix=_book public main
```

首先添加公有仓库的地址xxxx，然后用subtree将项目推送到github，这样就完成了个人网站的部署工作，部署完成之后，只需要通过usename.github.io就可以访问到个人网站。

4、当个人网站项目再次更新之后，需要重新推送到github，只需要重复上述命令即可

```
npm run serve
git add .
git commit -m "message"
git push origin main
git subtree push --prefix=_book public main
```

第一条命令是编译项目，使得markdown文件编译为html静态网页。后面几条命令是提交到私有仓库，最后一条命令是将静态页面提交到公有仓库。