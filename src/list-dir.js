'use strict';
const fs = require('fs');
const path = require("path");
const promisify = require('util').promisify;

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);


/**
 * 
 * @param {string} filename 
 */
function readDirAndFile(filename) {
  return stat(filename).then(stats => {
    if (stats.isFile()) {
      return filename;
    } else if (stats.isDirectory()) {
      return listDir(filename);
    } else {
      console.warn("unkown file", filename);
    }
    /**
     * @type string[]
     */
    const res = [];
    return res;
  })
}

/**
 * 
 * @param {string} dir 
 * @returns {Promise<string[]>}
 */
function listDir(dir) {
  return readdir(dir)
    .then(files => files.map((f) => path.join(dir, f)))
    .then(fileNames => fileNames.map(readDirAndFile))
    .then(fileList => Promise.all(fileList))
    .then(files => files.reduce((pre, f) => pre.concat(f), []))
}

module.exports = listDir;