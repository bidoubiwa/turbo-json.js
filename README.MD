# Combine-json

Combine-json is a CLI tool that combines all json files found in a directory into one big json file.

It takes as argument a directory in which to find the json files and a output file name in which the json files will combined.
The json file will be created in the directory where the CLI is used.

It accepts either json object files and json array files.
It accepts relative path but also fully qualified paths.

## Installation
```bash
npm i
npm run link
```

## Usage 
`combine-json [inputDir] [outputFile(optionnal)]`
```bash
combine-json misc myOutPutFile.json
```