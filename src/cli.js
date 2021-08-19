#!/usr/bin/env node
const commander = require('commander');
const pkg = require('../package.json');
const combineJson = require('./combine-json');

const program = new commander.Command()


program
  .argument(
    '<input-directory>',
    'Directory from witch to fetch the json files'
  )
  .version(pkg.version)
  .option(
    '-b, --buffer-size <integer>',
    'Size in bytes in which files will be read and written'
  )
  .option(
    '-o, --output-file <file-name>',
    'File name in which all the json files will be merged',
    'combine.json'
  )
  .action(async (directory, options) => {
    await combineJson({ options, inputDir: directory});
  });



(async () => {
  try {
    if (process.argv.length < 3) {
      console.log( program.helpInformation() );
    }
    await program.parse()
  } catch (e) {
    console.error(e);
    throw e;
  }
})();
