#!/usr/bin/env node
const { program } = require('commander');
const pkg = require('../package.json');
const combineJson = require('./combine-json');

program
  .version(pkg.version)
  .requiredOption(
    '-i, --input-dir <dir-path>',
    'Directory in which the json files are present'
  )
  .option(
    '-o, --output-file <file-name>',
    'File name in which all the json files will be merged',
    'combine.json'
  )
  .parse(process.argv);

(async () => {
  try {
    const options = program.opts();
    console.log(options);
    await combineJson(options);
  } catch (e) {
    console.error(e);
    throw e;
  }
})();
