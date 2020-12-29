#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require("path");

const initTemplate = require("../src/init");
const packageTeamsApp = require("../src/index");

const helpMessage = `

Usage:
  package-teams-app [inputFolder] [outputFile]    Pacakge your manifest folder.
  package-teams-app --init [initDir]              Init an template manifest folder.
  package-teams-app --help                        Print help messages.

Examples:
  package-teams-app manifest
  package-teams-app manifest build/download.zip
  package-teams-app --init manifest

Tips for Environment load order:
  .env.\${NODE_ENV}.local
  .env.local
  .env.\${NODE_ENV}
  .env
`;
const defaultDir = "manifest";
const args = process.argv.slice(2);



if (args.length == 0 && fs.existsSync(defaultDir)) {
  args[0] = defaultDir;
}

if (args.length == 0 || args[0] == "--help" || args[0] == "-h") {
  const intro = "Package Micosoft Teams app manifest.\n All the Template strings in json files will be replaced by environment variables."
  console.log(intro + helpMessage)
} else if (args[0] == "--init" || args[0] == "-i") {
  const initDir = args[1] || defaultDir
  console.log("init", initDir);
  initTemplate(initDir).then(() => console.log("Template manifest files copy to", initDir));
} else if (!fs.existsSync(args[0])) {
  console.error(args[0], "not exists!" + helpMessage);
  process.exit(1);
} else {
  const src = args[0];
  packageTeamsApp(src, args[1])
    .then(outfile => console.log("Package manifest:", src, "==>", outfile));
}