let puppeteer = require('puppeteer');

module.exports = async (url) => {
  let browser = await puppeteer.launch();
  let page = await browser.newPage();
  await page.goto(url);
  await page.addScriptTag({url: 'https://cdn.bootcss.com/jquery/3.2.0/jquery.min.js'});
  await page.waitFor(2000);
  
  let reslut = await page.evaluate(function (){
    let json = [];
    let resources = $('#resources').children('.resource');

    resources.each((index, el) => {
      let module = $(el).children('.heading').children('h2').text().split(':')[1].trim();
      let apis = [];

      let apis_el = $(el).children('.endpoints').children('.endpoint');
      apis_el.each((i, e) => {
        let api = $(e).children('.operations').children('.operation').children('.heading');

        let path = api.children('h3').children('.path').text().trim();
        let type = api.children('h3').children('.http_method').children('a').text();
        let note = api.children('.options').children('li').children('a').text().trim();

        let pathSplit = path.split('/');
        let len = pathSplit.length;
        let name = (pathSplit[len - 3] || '') + (function (name){return name.charAt(0).toUpperCase() + name.slice(1)})(pathSplit[len - 2]).replace(/-/g,"") + (function (name){return name.charAt(0).toUpperCase() + name.slice(1)})(pathSplit[len - 1]).replace(/-/g,"");
        // let name = pathSplit[len - 3] + (function (name){return name.charAt(0).toUpperCase() + name.slice(1)})(pathSplit[len - 2]) + (function (name){return name.charAt(0).toUpperCase() + name.slice(1)})(pathSplit[len - 1]);
        apis.push({ note, name, type, path});
      });

      json.push(
        { module, apis }
      );
    });
    return json;
  });

  await browser.close();

  return reslut;
};
