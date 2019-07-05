#!/usr/bin/env node

let fs = require('fs');
let path = require('path');
let puppeteer = require('puppeteer');

let param = process.argv.slice(2);
let url = param[0];
let outputPath = path.resolve(param[1] || '');

if(!url) {
  console.log('usage: parse-swagger [url] [filePath]');
  return void(0);
};

(async () => {
  let browser = await puppeteer.launch();
  let page = await browser.newPage();
  await page.goto(url);
  await page.addScriptTag({url: 'https://cdn.bootcss.com/jquery/3.2.0/jquery.min.js'});
  await page.waitFor(2000);
  
  let reslut = await page.evaluate(function (){

    let apis = [];
    let resources = $('#resources').children('.resource');
    resources.each((index, el) => {

      let name = $(el).children('.heading').children('h2').text().split(':')[1].trim();
      let items = [];

      let apis_el = $(el).children('.endpoints').children('.endpoint');
      apis_el.each((i, e) => {
        let item = $(e).children('.operations').children('.operation').children('.heading');
        let path = item.children('h3').children('.path').text().trim();
        let note = item.children('.options').children('li').children('a').text().trim();
        let pathSplit = path.split('/');
        let len = pathSplit.length;
        let name = pathSplit[len - 3] + (function (name){return name.charAt(0).toUpperCase() + name.slice(1)})(pathSplit[len - 2]) + (function (name){return name.charAt(0).toUpperCase() + name.slice(1)})(pathSplit[len - 1]);
        items.push({ name, path, note });
      });

      apis.push(
        { name, items }
      );

    });
    return apis;
  });

  await browser.close();

  let outputStr = '';
  let startTxt = 'export default {\r\n';
  let endTxt = '}\r\n';

  reslut.map(v => {
    outputStr += '\r\n  /**  \r\n  *'+ v.name +'\r\n  */\r\n\r\n';
    v.items.map(item => {
      outputStr += '  // ' + item.note + '\r\n';
      outputStr += '  ' + item.name + ': ' + "'" + item.path +"',\r\n\r\n";
    })
  })

  let txt = startTxt + outputStr + endTxt;
  fs.writeFile(outputPath, txt, 'utf8', err => {
    if(err) {
      console.log(outputPath + '不存在！');
      throw err;
    }
  });

})();
