"use strict";
const https = require("https");
const path = require("path");
const fs = require("fs");
const promisify = require("util").promisify;
const Validator = require("jsonschema").Validator;

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

/**
 * request remote https
 * @param {string} url
 * @returns {Promse<string>}
 */
function request(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`Status Code: ${res.statusCode}`));
      }
      const data = [];
      res.on("data", (chunk) => {
        data.push(chunk);
      });
      res.on("end", () => resolve(Buffer.concat(data).toString()));
    });
    req.on("error", reject);
    req.end();
  });
}

/**
 * load JSON schema form url with cache
 * @param {string} url
 * @returns {Promise<object>}
 */
function loadSchema(url) {
  const URI = new URL(url);
  const cacheFile = path.join(
    "./node_modules",
    ".cache",
    URI.hostname,
    URI.pathname
  );
  if (fs.existsSync(cacheFile)) {
    console.debug("loading cache", cacheFile);
    return readFile(cacheFile).then(JSON.parse);
  } else {
    console.debug("download", url);
    return request(url).then((s) => {
      const res = JSON.parse(s);
      return mkdir(path.dirname(cacheFile), { recursive: true })
        .then(() => writeFile(cacheFile, s))
        .then(() => res)
        .catch(() => res);
    });
  }
}

/**
 * replaceBuffer is a single function that accepts a string (and an optional object of options) as a parameter and returns an interpolated string with varaibles replaced by matching environment variables (located in `env`).
 *
 * It will throw if a matching variable is not found in `env` and will return the string that was passed if nothing was found to interpolate.
 * @param  {Buffer} buffer JSON Buffer
 * @return {Buffer}
 */
function validate(buffer) {
  const jsonStr = buffer.toString();
  const manifest = JSON.parse(jsonStr);
  const validator = new Validator();
  const $schema = manifest.$schema;

  if ($schema) {
    return loadSchema(manifest.$schema).then((schema) => {
      const result = validator.validate(manifest, schema);
      result.errors.forEach((err) => {
        console.error(err);
      });
      return result.valid;
    });
  }
  return true;
}

module.exports = validate;
