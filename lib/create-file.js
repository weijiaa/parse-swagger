'use strict';
 
const fs    = require('fs');
const path  = require('path');

function parsePath (_path) {
  let dirNames, fileName; 
  const {dir, base, ext} = path.parse(_path);
  if (ext) {
    dirNames = dir.split('/');
    fileName = base;
  } else {
    dirNames = [...dir.split('/'), base];
  }
  return {dirNames, fileName};
}

function createFile(writePath, text) {

  let {dirNames, fileName} = parsePath(writePath);
  let cPath = path.resolve();
  writePath += fileName ? '' : 'urls.js';

  dirNames.map(dir => {
    cPath = path.resolve(cPath, dir);
    if(!fs.existsSync(cPath)) {
      fs.mkdirSync(cPath);
    }
  });

  fs.writeFile(writePath, text, 'utf8', err => {
    if(err) throw err;
  });
  
}

module.exports = createFile;
