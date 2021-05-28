const fs = require('fs');
const chalk = require('chalk');
const {
  inputFilesAndDir,
  resolveOutputFilePath,
  filterNonJson,
  createOutputArrayFile,
  openFile,
  fileSize,
} = require('./file-utils');
const { jsonRootType, closingArrayIndex } = require('./json-root-type');

const BUFFER_SIZE = 8;
// TODO be able to improve buffer size

async function combine({ inputFiles, inputDirPath, outputFilePath }) {
  createOutputArrayFile(outputFilePath);
  const numberOfFiles = inputFiles.length;

  for (let index = 0; index < numberOfFiles; index++) {
    let fileName = inputFiles[index];
    let inputFile = `${inputDirPath}${fileName}`;

    const inputFileFd = openFile(inputFile);

    const { isArray, typeIndex, empty } = jsonRootType({
      fd: inputFileFd,
      bufferSize: BUFFER_SIZE,
    });

    let lastBracket = undefined;

    if (isArray) {
      lastBracket =
        closingArrayIndex({
          inputFile,
          fd: inputFileFd,
          position: fileSize(inputFile) - BUFFER_SIZE,
        }) - 2;
    }
    // open destination file for appending
    var writeStream = fs.createWriteStream(outputFilePath, {
      flags: 'a',
    });

    // open source file for reading
    let startPosition = isArray ? typeIndex + 1 : typeIndex;
    var readStream = fs.createReadStream(inputFile, {
      start: startPosition,
      end: lastBracket,
    });

    readStream.pipe(writeStream);

    await new Promise(function (resolve) {
      writeStream.on('close', function () {
        resolve();
      });
    });

    let last = index === numberOfFiles - 1;

    if (!last && !empty) {
      let comaWrite = fs.createWriteStream(outputFilePath, {
        flags: 'a',
      });

      await new Promise(function (resolve) {
        comaWrite.write(',', () => {
          resolve('');
        });
      });
    } else if (last) {
      let closingBracketWrite = fs.createWriteStream(outputFilePath, {
        flags: 'a',
      });

      await new Promise(function (resolve) {
        closingBracketWrite.write(']', () => {
          resolve('');
        });
      });
    }

    console.log(
      chalk.green(
        'file: ' +
          chalk.blue.underline.bold(fileName) +
          ` has been added! last : ${last}, index: ${index}, numberOfFiles: ${numberOfFiles}`
      )
    );
  }
  return 1;
}

async function combineJson({ inputDir, outputFile = 'combine.json' }) {
  try {
    const { inputDirPath, filesName } = inputFilesAndDir({ inputDir });
    const outputFilePath = resolveOutputFilePath({ fileName: outputFile });
    const inputFiles = filterNonJson({ filesName });
    return await combine({ inputFiles, inputDirPath, outputFilePath });
  } catch (e) {
    throw e;
  }
}

module.exports = combineJson;
