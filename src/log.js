const chalk = require('chalk')

const logSuccessfullWrite = (fileName, index, numberOfFiles) => {
  console.log(
    chalk.green(
      'file: ' +
        chalk.blue.underline.bold(fileName) +
        ` has been added! index: ${index}, number of files: ${numberOfFiles}`
    )
  )
}

const logFailedValidityCheck = error => {
  console.log(
    chalk.yellow(
      `Invalid file is ignored: ${chalk.blue.underline.bold(error.file)}: ${
        error.error
      }`
    )
  )
}

const logFailedOutputValidityCheck = error => {
  console.log(
    chalk.red(
      `Output file is invalid: ${chalk.blue.underline.bold(error.file)}: ${
        error.error
      }`
    )
  )
}

module.exports = {
  logSuccessfullWrite,
  logFailedValidityCheck,
  logFailedOutputValidityCheck,
}
