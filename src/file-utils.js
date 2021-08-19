const path = require('path')
const fs = require('fs')

function resolveDir({ dir }) {
  dir = path.resolve(dir)
  if (!fs.existsSync(dir)) {
    // test for Fully Qualified path
    console.log(`Error: ${dir} no such named directory`)
    process.exit()
  }
  return dir
}

function outputFile({ dirName, fileName = undefined }) {
  fileName = fileName || 'combined.json'
  return `${dirName}/${fileName}`
}

function inputFilesAndDir({ inputDir }) {
  const resolvedDir = resolveDir({ dir: inputDir })
  const inputDirPath =
    resolvedDir + (resolvedDir[resolvedDir.length - 1] === '/' ? '' : '/') // add slash at the end of the dir if it is not there yet
  const filesName = fs.readdirSync(inputDirPath) // read all files names in dir
  return {
    inputDirPath,
    filesName,
  }
}

function resolveOutputFilePath({ fileName }) {
  const workingDir = process.cwd()
  const outputFilePath = outputFile({ dirName: workingDir, fileName })
  createFileIfNotExist(outputFilePath)
  return outputFilePath
}

function createFileIfNotExist({ file }) {
  if (fs.existsSync(file)) {
    fs.writeFileSync(file, '')
  }
}

function filterNonJson({ filesName }) {
  return filesName.reduce((acc, file) => {
    if (path.extname(file) === '.json') return [...acc, file]
    return acc
  }, [])
}

function createOutputArrayFile(outputFilePath) {
  fs.writeFileSync(outputFilePath, '[') // start of new file
}

function openFile(file) {
  return fs.openSync(file)
}

function fileSize(file) {
  let stats = fs.statSync(file)
  return stats.size
}

module.exports = {
  fileSize,
  resolveDir,
  outputFile,
  inputFilesAndDir,
  resolveOutputFilePath,
  createFileIfNotExist,
  filterNonJson,
  createOutputArrayFile,
  openFile,
}
