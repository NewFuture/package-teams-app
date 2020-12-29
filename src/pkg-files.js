'use strict';
const fs = require('fs');
const AdmZip = require("adm-zip");

/**
 * 
 * @param {string[]}  files 
 * @param {number} prefixlen 
 * @param {string} to 
 */
function pkgFiles(files, prefixlen, to) {
  const zip = new AdmZip();
  files.forEach(f => {
    const zipFileName = f.substr(prefixlen || 0);
    // console.log(zipFileName);
    if (f && f.endsWith(".json")) {
      const data = fs.readFileSync(f);
      zip.addFile(zipFileName, data);
    } else {
      zip.addLocalFile(f, "", zipFileName);
    }
  })
  zip.writeZip(to)
}

module.exports = pkgFiles;

