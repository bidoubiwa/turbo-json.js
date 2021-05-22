const fs = require('fs');
const chalk = require('chalk');
const path = require('path')
const {
    inputFilesAndDir,
    resolveOutputFilePath,
    filterNonJson
  } = require('./file_utils')

function findLastBracket(filePath, fd, buffer, position) {
    let charRed = fs.readSync(fd, buffer, 0, 8, position);
    let array = [...buffer].map(char => String.fromCharCode(char));
    let bracket = array.indexOf("]");
    if (charRed === 0) return null;
    if (bracket > -1) return position + bracket + 1;
    fs.closeSync(fd)
    fd = fs.openSync(filePath);
    return getLastBracket(filePath, fd, position - 8)
}

function getLastBracket(filePath, fd, position) {
    let buffer = new Int8Array(8);
    return findLastBracket(filePath, fd, buffer, position);
}

function findFirstBracketType(fileFd, buffer, position) {
    let charRed = fs.readSync(fileFd, buffer, 0, 8)
    let array = [...buffer].map(char => String.fromCharCode(char));
    let curly = array.indexOf("{");
    let bracket = array.indexOf("[");
    if (charRed === 0) return null;
    if ((curly < bracket || bracket === -1) && curly > -1) return {
        type: "{",
        pos: position + curly
    }
    if ((bracket < curly || curly === -1) && bracket > -1) return {
        type: "[",
        pos: position + bracket
    }
    return findFirstBracketType(fileFd, buffer, position + 8)
}

function getFirstBracketType(fd) {
    let buffer = new Int8Array(8);
    return findFirstBracketType(fd, buffer, 0);
}

async function combine({inputFiles, inputDirPath, outputFilePath}) {
    fs.writeFileSync(outputFilePath, "["); // start of new file
    const numberOfFiles = inputFiles.length
    numberOfFiles.map(( fileName, index) => {
        let inputFile = `${inputDirPath}${fileName}`;

        // open destination file for appending
        const writeStreamPath = fs.createWriteStream(outputFilePath, {
            flags: 'a'
        });

        let start = (isArray) ? firstBracketType.pos + 1 : firstBracketType.pos;

    })
    for (let index = 0; index < numberOfFiles; index++) {
        let file = inputFiles[index];
        let inputFile = `${inputDirPath}${file}`;

        const fd = fs.openSync(`${inputDirPath}${file}`);
        let firstBracketType = getFirstBracketType(fd);
        let lastBracket = undefined;


        if (firstBracketType) {
            let isArray =  firstBracketType.type === '[';
            if (isArray) {
                let stats = fs.statSync(inputFile)
                lastBracket =  getLastBracket(inputFile, fd, stats.size - 8) - 2;
            }
            // open destination file for appending
            var w = fs.createWriteStream(outputFilePath, {
                flags: 'a'
            });
            // open source file for reading
            let start = (isArray) ? firstBracketType.pos + 1 : firstBracketType.pos;
            var r = fs.createReadStream(inputFile, {
                start,
                end: lastBracket
            });

            r.pipe(w);
            const combineFiles = new Promise(function(resolve, reject) {
                w.on('close', function() {
                    resolve('foo');
                    console.log("done writing");
                });
              });
            await combineFiles;


            let last = (index === numberOfFiles - 1);

            if (!last) {
                let coma = path.resolve(__dirname, '../assets/coma')
                let comaWrite = fs.createWriteStream(outputFilePath, {
                    flags: 'a'
                });
                let comaRead = fs.createReadStream(coma);
                comaRead.pipe(comaWrite);
                const addComa = new Promise(function(resolve, reject) {
                    comaWrite.on('close', function() {
                        resolve('foo');
                        console.log("done writing coma");
                    });
                  });
                await addComa
            } else {
                let closingBracket = path.resolve(__dirname, '../assets/closing_bracket');
                let closingBracketWrite = fs.createWriteStream(outputFilePath, {
                    flags: 'a'
                });
                let closingBracketRead = fs.createReadStream(closingBracket);
                closingBracketRead.pipe(closingBracketWrite);
                const addclosingBracket = new Promise(function(resolve, reject) {
                    closingBracketWrite.on('close', function() {
                        resolve('foo');
                        console.log("done writing closingBracket");
                    });
                  });
                await addclosingBracket
            }
            console.log(chalk.green(
                'file: ' +
                chalk.blue.underline.bold(file) +
                ` has been added! last : ${last}, index: ${index}, numberOfFiles: ${numberOfFiles}`
            ))
        }
    }
}


async function combineJson(inputDir, outputFile = undefined) {
    try {
        const { inputDirPath, filesName } = inputFilesAndDir({ inputDir })
        const outputFilePath = resolveOutputFilePath({ fileName: outputFile })
        const inputFiles = filterNonJson({ filesName });
        await combine({inputFiles, inputDirPath, outputFilePath})
    }catch(e) {
        throw(e)
    }
}

module.exports = combineJson


