'use strict';
const fs = require('fs');
const path = require("path");
const listDir = require("./list-dir");

const TEMPLATE_DIR = path.join(__dirname, "../manifest");

/**
 * 
 * @param {string} dir 
 * @returns {string[]}
 */
function copyToDir(dir) {
  const files = listDir(TEMPLATE_DIR);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  files.forEach(function (f) {
    fs.copyFileSync(f, path.join(dir, path.relative(TEMPLATE_DIR, f)))
  })
}

module.exports = copyToDir;
