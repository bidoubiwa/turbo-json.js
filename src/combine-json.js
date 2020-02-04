#!/usr/bin/env node
const fs = require('fs');
const chalk = require('chalk');
const path = require('path')

function outputDir() {
    let fileName = (process.argv[3]) ? process.argv[3] : 'combined.json';
    return `${outputDir}/${fileName}`;
}

function combineJson(files, dir, outputDir) {
    
    let outputFile = outputPath(outputDir); 
    let filePath = dir + ((dir[dir.length - 1] === '/') ? '' : '/') // add slash at the end of the dir if it is not there yet
    if (fs.existsSync(outputFile)) {
        fs.writeFileSync(outputFile, "");
    }
    fs.writeFileSync(outputFile, "[");
    const jsonFiles = files.reduce((acc, file)=>{
        if (path.extname(file)=== '.json') return [...acc, file];
        return acc;
    }, []);
    const filesLen = jsonFiles.length
    jsonFiles.map((file, index) => {    
        let content = require(`${filePath}${file}`);
        let isArray =  Array.isArray(content);
        content = JSON.stringify(content);
        if (isArray) content = content.substr(1, content.length - 2);
        let last = (index === filesLen - 1);      
        fs.appendFileSync(outputFile, `${content}${(last)? "" : ","}\n`);
        console.log(chalk.green(
            'file: ' +
            chalk.blue.underline.bold(file) +
            ` has been added! last : ${last}, index: ${index}, filesLen: ${filesLen}`
        ))
    })
    fs.appendFileSync(outputFile, `]`);
}


function determineDir(dir) {
    dir = path.resolve(dir);
    if (!fs.existsSync(dir)) {  // test for Fully Qualified path
        console.log(`Error: ${process.argv[2]} no such named directory`);
        process.exit()
    }
    return dir;
}

if (process.argv.length === 2) {
    console.log(chalk.red('Error: Missing path argument'));
} 
else {
    try {
        let dir = determineDir(process.argv[2])   
        console.log({ dir });
        let outputDir = process.cwd();
        let files = fs.readdirSync(dir)
        
        combineJson(files, dir, outputDir)
    }catch(e) {
        throw(e)
    }
}

