## 安装
    npm install -g parse-swagger
    npm install -g puppeteer
## 使用
	默认文件名为urls.js
    parse-swagger  swagger地址  [输出文件路径]
urls：
```javascript
let json = [
  {
    "module": "卡片相关",
    "apis": [
      {
        "note": "卡片信息",
        "name": "cardCardDetail",
        "type": "post",
        "path": "card/cardDetail"
      }
    ]
  }
];
export default ((json) => {
  let reslut = {};

  json.map(m => {
    m.apis.map(api => {
      reslut[api.name] = api.path;
    })
  })

  return reslut;
})(json)
```