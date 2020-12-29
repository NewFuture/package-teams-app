'use strict';
const fs = require('fs');
const path = require("path");
const promisify = require('util').promisify;
const listDir = require("./list-dir");

const TEMPLATE_DIR = path.join(__dirname, "../manifest");
const fsAccess = promisify(fs.access);
const mkdir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);

/**
 * 
 * @param {string} dir 
 */
function copyToDir(dir) {

  return fsAccess(dir).catch(() => mkdir(dir))
    .then(() => listDir(TEMPLATE_DIR))
    .then(files => files.map(f => copyFile(f, path.join(dir, path.relative(TEMPLATE_DIR, f)))))
    .then(copyTasks => Promise.all(copyTasks));
}

module.exports = copyToDir;
