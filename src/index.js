'use strict';
const getClientEnvironment = require("./env");
const listDir = require("./list-dir");
const pkgFiles = require("./pkg-files");

/**
 * 
 * @param {string} src 
 * @param {string} manifest
 * @returns {Promise<string>}
 */
function packageTeamsApp(src, manifest = "") {
  if (!manifest) {
    // manifest, manifest/ , manifest\ ==> manifest.zip
    manifest = (src || "manifest").replace(/[\\\/]?$/, ".zip")
  } else if (!manifest.endsWith(".zip")) {
    manifest += ".zip"
  }
  return Promise.all([getClientEnvironment(), listDir(src)])
    .then((res) => {
      return pkgFiles(res[1], src, manifest, res[0]);
    }).then(() => manifest);
}

module.exports = packageTeamsApp;