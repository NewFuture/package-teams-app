'use strict';
const fs = require('fs');
const AdmZip = require("adm-zip");
const replace = require("./replace");

/**
 * 
 * @param {string[]}  files 
 * @param {number} prefixlen 
 * @param {string} to 
 * @param {object} env
 */
function pkgFiles(files, prefixlen, to ,env) {
  const zip = new AdmZip();
  files.forEach(f => {
    const zipFileName = f.substr(prefixlen || 0);
    // console.log(zipFileName);
    if (f && f.endsWith(".json")) {
      const data = fs.readFileSync(f);
      const replaceData = replace(data,env);
      zip.addFile(zipFileName, replaceData);
    } else {
      zip.addLocalFile(f, "", zipFileName);
    }
  })
  zip.writeZip(to)
}

module.exports = pkgFiles;

