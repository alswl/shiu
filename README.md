# Shiu #

Shiu (/ʃʐy/)，中文音标 (shi rü))，是一款基于 WebApp 的阅读应用，
愿景是带来阅读新体验。

## 使用 ##

1. 使用 iOS / Android 访问 [http://shiu.log4d.com](http://shiu.log4d.com)
1. 选择需要下载的小说
1. Shiu 会自动开始下载
1. 下载完成之后，iOS 「添加至主屏幕」，Android 会自动刷新开始进入阅读模式。

## 制作书籍 ##

使用 `manager.py` 可以自己制作书籍，过程如下：

1. 新建目录比如 `santi2`
1. 准备书籍的 txt 格式文件按章节从 `01` 开始命名，并放置在 `santi2/src` 目录中
1. 准备书籍信息 `info.ini` 内容可以参考
[santi1/src/info.ini](https://github.com/alswl/shiu/blob/master/santi1/src/info.ini)
1. 运行命令 `manager.py --parse-dir /the/path/of/book` 就可以生成书籍数据
1. 修改 `index.html` 将书籍链接加到对应地方
1. 运行命令 `manager.py --serve` 即可在本地启动服务

## 幻灯片 ##

我曾经拿 Shiu 的开发过程做过一次小分享，幻灯片已经上传放到 `slide` 目录，
可以用来参考。

更多开发信息可以查看 [开发记录](https://github.com/alswl/shiu/blob/master/shiu_dev.asciidoc)

## Licenses ##

[MIT License](http://www.opensource.org/licenses/MIT)

This project is maintained by [@alswl](http://log4d.com).
