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
const { verifyJson } = require('./json-validity')

const BUFFER_SIZE = 1000;

async function combine({ inputFiles, inputDirPath, outputFilePath }) {
  createOutputArrayFile(outputFilePath);
  const numberOfFiles = inputFiles.length;
  let first = true;
  for (let index = 0; index < numberOfFiles; index++) {
    try {
      let fileName = inputFiles[index];
      let inputFile = `${inputDirPath}${fileName}`;

      await verifyJson({jsonFile: inputFile})
      const inputFileFd = openFile(inputFile);

      const { isArray, startPosition, empty } = jsonRootType({
        fd: inputFileFd,
        bufferSize: BUFFER_SIZE,
      });

      let stopPosition = undefined;

      if (isArray) {
        stopPosition =
          closingArrayIndex({
            fd: inputFileFd,
            position: (fileSize(inputFile) - BUFFER_SIZE > 0) ? fileSize(inputFile) - BUFFER_SIZE : 0,
            bufferSize: BUFFER_SIZE
          });
      }

      if (!empty && !first) {
        let comaWrite = fs.createWriteStream(outputFilePath, {
          flags: 'a',
        });

        await new Promise(function (resolve) {
          comaWrite.write(',', () => {
            resolve('');
          });
        });
      } else if (!empty) {
        first = false
      }

      // open destination file for appending
      var writeStream = fs.createWriteStream(outputFilePath, {
        flags: 'a',
      });

      // open source file for reading
      var readStream = fs.createReadStream(inputFile, {
        start: startPosition,
        end: stopPosition,
      });

      readStream.pipe(writeStream);

      await new Promise(function (resolve) {
        writeStream.on('close', function () {
          resolve();
        });
      });

      console.log(
        chalk.green(
          'file: ' +
            chalk.blue.underline.bold(fileName) +
            ` has been added! index: ${index}, number of files: ${numberOfFiles}`
        )
      );
    }
    catch (e) {
      console.log(chalk.yellow(
        `Invalid file is ignored: ${chalk.blue.underline.bold(e.file)}: ${e.error}`
      ))
    }
  }

  let closingBracketWrite = fs.createWriteStream(outputFilePath, {
    flags: 'a',
  });

  await new Promise(function (resolve) {
    closingBracketWrite.write(']', () => {
      resolve('');
    });
  });
  await verifyJson({jsonFile: outputFilePath})
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
