'use strict';
const fs = require('fs');
const promisify = require('util').promisify;

const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const fsAccess = promisify(fs.access);

function getClientEnvironment() {
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const dotenvFiles = [
    `.env.${NODE_ENV}.local`,
    `.env.local`,
    `.env.${NODE_ENV}`,
    '.env',
  ].filter(Boolean);

  const promise = dotenvFiles
    .map(dotenvFile => fsAccess(dotenvFile).then(() => {
      console.log("load env:", dotenvFile);
      dotenvExpand(dotenv.config({ path: dotenvFile, }));
    }, () => { })).reduce((promises, p) => {
      // run each promise
      return p ? promises.then(() => Promise.resolve(p)) : promises;
    }, Promise.resolve());

  return promise.then(() => Object.keys(process.env)
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches React into the correct mode.
        NODE_ENV: NODE_ENV,
      }
    ));
}

module.exports = getClientEnvironment;