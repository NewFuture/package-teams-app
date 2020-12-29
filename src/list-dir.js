'use strict';
const fs = require('fs');
const path = require("path");

/**
 * 
 * @param {string} dir 
 * @returns {string[]}
 */
function readDir(dir) {
  const files = fs.readdirSync(dir);
  return files.reduce((pre, f) => {
    const filename = path.join(dir, f);
    const stats = fs.statSync(filename);
    if (stats.isFile()) {
      pre.push(filename)
    } else if (stats.isDirectory()) {
      return pre.concat(readDir(filename));
    } else {
      console.warn("unkown file", filename);
    }
    return pre;
  }, []);
}

module.exports = readDir;