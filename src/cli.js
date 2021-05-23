#!/usr/bin/env node
const combineJson = require('./combine-json');

(async () => {
  try {
    if (process.argv.length === 2) {
      console.log(chalk.red('Error: Missing path argument'));
    } else {
      await combineJson(process.argv[2], process.argv[3]);
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
})();
