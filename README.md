#meituan_effects

美团杯比赛 - 视频特效

`dev` 为开发目录， `dist` 为项目生成目录。  
如果不想使用 gulp 可以直接编辑 dist 下文件， 但一定要粘到 dev 下。


### 具体要编辑内容：
- js/effects.js: 为 `imageProcess` 对象添加方法， 具体可参照 `imageProcess.gray`, `imageProcess` 的其他可调用方法见 js/imageProcess.js.
- html/index.html 内 `select` 内增加 `option`， `value` 属性值为上面添加的方法名

### 运行
本地文件没有调用摄像头权限，需本地开服务器程序。可使用 `python -m SimpleHTTPServer`
