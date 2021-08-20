const fs = require('fs')

const {
  inputFilesAndDir,
  resolveOutputFilePath,
  filterNonJson,
  createOutputArrayFile,
  openFile,
  fileSize,
} = require('./file-utils')
const { jsonRootType, closingArrayIndex } = require('./json-root-type')
const { verifyJson } = require('./json-validity')
const {
  logSuccessfullWrite,
  logFailedValidityCheck,
  logFailedOutputValidityCheck,
} = require('./log')

const BUFFER_SIZE = 1000

async function combine({
  inputFiles,
  inputDirPath,
  outputFilePath,
  validateInput,
  validateOutput,
}) {
  createOutputArrayFile(outputFilePath)
  const numberOfFiles = inputFiles.length
  let first = true
  for (let index = 0; index < numberOfFiles; index++) {
    try {
      let fileName = inputFiles[index]
      let inputFile = `${inputDirPath}${fileName}`

      if (validateInput) {
        await verifyJson({ jsonFile: inputFile })
      }
      const inputFileFd = openFile(inputFile)

      const { isArray, startPosition, empty } = jsonRootType({
        fd: inputFileFd,
        bufferSize: BUFFER_SIZE,
      })

      let stopPosition = undefined

      if (isArray) {
        stopPosition = closingArrayIndex({
          fd: inputFileFd,
          position:
            fileSize(inputFile) - BUFFER_SIZE > 0
              ? fileSize(inputFile) - BUFFER_SIZE
              : 0,
          bufferSize: BUFFER_SIZE,
        })
      }

      if (!empty && !first) {
        let comaWrite = fs.createWriteStream(outputFilePath, {
          flags: 'a',
        })

        await new Promise(function (resolve) {
          comaWrite.write(',', () => {
            resolve('')
          })
        })
      } else if (!empty) {
        first = false
      }

      // open destination file for appending
      var writeStream = fs.createWriteStream(outputFilePath, {
        flags: 'a',
      })

      // open source file for reading
      var readStream = fs.createReadStream(inputFile, {
        start: startPosition,
        ...(stopPosition && { end: stopPosition }),
      })

      readStream.pipe(writeStream)

      await new Promise(function (resolve) {
        writeStream.on('close', function () {
          resolve()
        })
      })

      logSuccessfullWrite(fileName, index, numberOfFiles)
    } catch (e) {
      if (e.file) {
        logFailedValidityCheck(e)
      } else {
        logFailedValidityCheck({
          file: inputFiles[index],
          error: e.message,
        })
      }
    }
  }

  let closingBracketWrite = fs.createWriteStream(outputFilePath, {
    flags: 'a',
  })

  await new Promise(function (resolve) {
    closingBracketWrite.write(']', () => {
      resolve('')
    })
  })
  if (validateOutput) {
    try {
      await verifyJson({ jsonFile: outputFilePath })
    } catch (e) {
      logFailedOutputValidityCheck(e)
    }
  }
  return 1
}

async function combineJson(
  inputDir,
  {
    outputFile = 'combined.json',
    validateInput = false,
    validateOutput = false,
  }
) {
  const { inputDirPath, filesName } = inputFilesAndDir({ inputDir })
  const outputFilePath = resolveOutputFilePath({ fileName: outputFile })
  const inputFiles = filterNonJson({ filesName })
  return await combine({
    inputFiles,
    inputDirPath,
    outputFilePath,
    validateInput,
    validateOutput,
  })
}

module.exports = combineJson
