'use strict';


const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const AdmZip = require("adm-zip");
const replace = require("./replace");


const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir)

/**
 * 
 * @param {string[]}  files 
 * @param {number} prefixlen 
 * @param {string} to 
 * @param {object} env
 * @returns {Promise<void>}
 */
function pkgFiles(files, prefixlen, to, env) {
  const zip = new AdmZip();
  const promises = files.map(f => {
    const zipFileName = f.substr(prefixlen || 0);
    if (f && f.endsWith(".json")) {
      return readFile(f)
        .then(buffer => replace(buffer, env))
        .then(buffer => zip.addFile(zipFileName, buffer))
    } else {
      return Promise.resolve(zip.addLocalFile(f, "", zipFileName));
    }
  })
  promises.push(mkdir(path.dirname(to), { recursive: true }))
  zip.addZipComment((env.npm_package_name || env.PACKAGE_NAME) + " manifest was packaged at " + Date() + " by [package-teams-app].");
  return Promise.all(promises).then(() => zip.writeZip(to));
}

module.exports = pkgFiles;

