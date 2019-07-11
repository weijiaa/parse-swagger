#!/usr/bin/env node

const getJSON     = require('./lib/getJSON');
const createFile  = require('./lib/create-file');

const param = process.argv.slice(2);
const [url, outputPath] = param;

if(!url) {
  console.log('usage: parse-swagger swagger-path [urls-path]');
  process.exit(-1);
}

if(url === '-V' || url === '-v' || url === '-version') {
  console.log(require('./package.json').version);
  process.exit(-1);
}

const parseJSON = (json) => {
  let reslut = {};

  json.map(m => {
    m.apis.map(api => {
      reslut[api.name] = api.path;
    })
  })

  return reslut;
}

(async () => {
  const apis = await getJSON(url);
  let text = `let json = ${JSON.stringify(apis, null, 2)};\r\nexport default (${parseJSON.toString()})(json)`;

  createFile(outputPath, text);
})();
