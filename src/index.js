'use strict';
const getClientEnvironment = require("./env");
const readDir = require("./list-dir");
const pkgFiles = require("./pkg-files");

/**
 * 
 * @param {string} src 
 * @param {string} manifest 
 */
function packageTeamsApp(src, manifest = "manifest") {
  const env = getClientEnvironment();
  if (!manifest.endsWith(".zip")) {
    manifest += ".zip"
  }
  const list = readDir(src);
  const len = src.endsWith("/") || src.endsWith("\\") ? src.length : src.length + 1;
  pkgFiles(list, len, manifest, env);
  console.log("Package manifest:", src, "==>", manifest);
}

module.exports = packageTeamsApp;

packageTeamsApp("test-manifest")