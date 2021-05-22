# Combine-json

Combine-json is a CLI tool that combines all json files found in a directory into one big json file using streaming.

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
combine-json directory
```
default output file is combined.json at the root of where you execute the cli.

## Try it out
Go at the root of the CLI
```bash
combine-json misc
```
it will generate a combined.json file with all the json object found in misc.
