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


let p = path.resolve('')
console.log(p, new fs.Dirent(p).isFile())
