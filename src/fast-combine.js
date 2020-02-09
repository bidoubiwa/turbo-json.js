#!/usr/bin/env node
const fs = require('fs');
const chalk = require('chalk');
const path = require('path')

function outputPath(outputDir) {
    let fileName = (process.argv[3]) ? process.argv[3] : 'combined.json';
    return `${outputDir}/${fileName}`;
}

function createIfNotExist(file) {
    if (fs.existsSync(file)) {
        fs.writeFileSync(file, "");
    }
}

function listOfJsonFiles(files){
    return  files.reduce((acc, file)=>{
        if (path.extname(file)=== '.json') return [...acc, file];
        return acc;
    }, []);
}

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

function getFirstBracketType(fd, file, filePath) {
    let buffer = new Int8Array(8);
    return findFirstBracketType(fd, buffer, 0);
}

async function combineJson(files, dir, outputDir) {
    
    let outputFile = outputPath(outputDir); 
    let filePath = dir + ((dir[dir.length - 1] === '/') ? '' : '/') // add slash at the end of the dir if it is not there yet
    createIfNotExist(outputFile)
    
    fs.writeFileSync(outputFile, "["); // start of new file
    const jsonFiles = listOfJsonFiles(files);
    const numberOfFiles = jsonFiles.length
    for (let index = 0; index < numberOfFiles; index++) {
        let file = jsonFiles[index];
        let inputFile = `${filePath}${file}`;
        // console.log({ inputFile });
        
        // let content = require(inputFile);
        const fd = fs.openSync(`${filePath}${file}`);
        let firstBracketType = getFirstBracketType(fd, file, filePath);
        let lastBracket = undefined;
        
        
        if (firstBracketType) {
            let isArray =  firstBracketType.type === '[';
            if (isArray) {
                let stats = fs.statSync(inputFile)
                lastBracket =  getLastBracket(inputFile, fd, stats.size - 8) - 2;
            }
            // open destination file for appending
            var w = fs.createWriteStream(outputFile, {
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

            
            // console.log(' apres', { start, lastBracket });
            
            let last = (index === numberOfFiles - 1);      
            console.log({ last });
            
            
            if (!last) {
                
                
                let coma = path.resolve(__dirname, '../assets/coma')
                let comaWrite = fs.createWriteStream(outputFile, {
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
                let closingBracketWrite = fs.createWriteStream(outputFile, {
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


function determineDir(dir) {
    dir = path.resolve(dir);
    if (!fs.existsSync(dir)) {  // test for Fully Qualified path
        console.log(`Error: ${process.argv[2]} no such named directory`);
        process.exit()
    }
    return dir;
}

(async () => {
    console.log();
    
    
    if (process.argv.length === 2) {
        console.log(chalk.red('Error: Missing path argument'));
    } 
    else {
        try {
            let dir = determineDir(process.argv[2])   
            console.log({ dir });
            let outputDir = process.cwd();
            let files = fs.readdirSync(dir)
            
            await combineJson(files, dir, outputDir)
        }catch(e) {
            throw(e)
        }
    }
})()


