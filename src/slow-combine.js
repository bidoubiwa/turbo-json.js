#!/usr/bin/env node
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');

function outputPath(outputDir) {
  let fileName = process.argv[3] ? process.argv[3] : 'combined.json';
  return `${outputDir}/${fileName}`;
}

function createIfNotExist(file) {
  if (fs.existsSync(file)) {
    fs.writeFileSync(file, '');
  }
}

function listOfJsonFiles(files) {
  return files.reduce((acc, file) => {
    if (path.extname(file) === '.json') return [...acc, file];
    return acc;
  }, []);
}

async function combineJson(files, dir, outputDir) {
  let outputFile = outputPath(outputDir);
  let filePath = dir + (dir[dir.length - 1] === '/' ? '' : '/'); // add slash at the end of the dir if it is not there yet
  createIfNotExist(outputFile);

  fs.writeFileSync(outputFile, '['); // start of new file
  const jsonFiles = listOfJsonFiles(files);
  const numberOfFiles = jsonFiles.length;

  for (let index = 0; index < numberOfFiles; index++) {
    let file = jsonFiles[index];

    let inputFile = `${filePath}${file}`;
    let content = require(inputFile);
    content = JSON.stringify(content);
    if (Array.isArray(content)) content = content.substr(1, content.length - 2);
    let last = index === numberOfFiles - 1;
    fs.appendFileSync(outputFile, `${content}${last ? '' : ','}\n`);
    console.log(
      chalk.green(
        'file: ' +
          chalk.blue.underline.bold(file) +
          ` has been added! last : ${last}, index: ${index}, numberOfFiles: ${numberOfFiles}`
      )
    );
  }
  fs.appendFileSync(outputFile, `]`);
}

function determineDir(dir) {
  dir = path.resolve(dir);
  if (!fs.existsSync(dir)) {
    // test for Fully Qualified path
    console.log(`Error: ${process.argv[2]} no such named directory`);
    process.exit();
  }
  return dir;
}

(async () => {
  if (process.argv.length === 2) {
    console.log(chalk.red('Error: Missing path argument'));
  } else {
    try {
      let dir = determineDir(process.argv[2]);
      console.log({ dir });
      let outputDir = process.cwd();
      let files = fs.readdirSync(dir);

      await combineJson(files, dir, outputDir);
    } catch (e) {
      throw e;
    }
  }
})();
