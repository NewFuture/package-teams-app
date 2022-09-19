'use strict';


const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const AdmZip = require("adm-zip");
const replace = require("./replace");
const validate = require("./validate");



const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir)

/**
 * 
 * @param {string[]}  files 
 * @param {string} prefix 
 * @param {string} to 
 * @param {object} env
 * @returns {Promise<void>}
 */
function pkgFiles(files, prefix, to, env) {
  const zip = new AdmZip();
  let invalid = false;
  const promises = files.map(f => {
    const zipFileName = path.relative(prefix, f);
    if (f && f.endsWith(".json")) {
      return readFile(f)
        .then(buffer => replace(buffer, env))
        .then(buffer => {
          zip.addFile(zipFileName, buffer);
          return validate(buffer).then((valid) => {
            if (valid) {
              console.info("√", f, "is valid");
            } else {
              console.error("×", f, "is invalid!!!");
              invalid = true;
            }
          }, (err) => {
            invalid = true;
            console.error("×", f, "is invalid with errs!!!");
            console.error(err);
          })
        })
    } else {
      return Promise.resolve(zip.addLocalFile(f, "", zipFileName));
    }
  })
  promises.push(mkdir(path.dirname(to), { recursive: true }))
  zip.addZipComment((env.npm_package_name || env.PACKAGE_NAME) + " manifest was packaged at " + Date() + " by [package-teams-app].");
  return Promise.all(promises).then(() => zip.writeZipPromise(to)).then(() => {
    if (invalid) {
      throw "Shema is invalid"
    }
  });
}

module.exports = pkgFiles;

