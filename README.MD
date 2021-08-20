<h1 align="center">Turbo 🐡 JSON </h1>

<p align="center">
  <img src="assets/boat.png" width=300 />

  <!-- <a href="https://www.npmjs.com/package/meilisearch"><img src="https://img.shields.io/npm/v/meilisearch.svg" alt="npm version"></a> -->
  <a href="https://github.com/bidoubiwa/turbo-json.js/actions"><img src="https://github.com/bidoubiwa/turbo-json.js/workflows/Tests/badge.svg" alt="Tests"></a>
  <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg" alt="Prettier"></a>
  <a href="https://github.com/bidoubiwa/turbo-json.js/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-informational" alt="License"></a>
  <a href="https://app.bors.tech/repositories/36206"><img src="https://bors.tech/images/badge_small.svg" alt="Bors enabled"></a>

</p>

turbo-json.js is a tool that combines all json files found in a directory into one big json file using **streaming** to avoid out-of-memory.

```bash
npx turbo-json data/
# Outputs `combined.json` file containing the content of all json files found in the data/ directory
```

All json files found in `data` directory will be combined into one file that is named `combined.json` par default.

Both `read` and `write` actions are done using `streaming`. The maximum data stored in memory is the buffer size.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [How is it combined](#how-is-it-combined)
- [Validate JSON format](#validate-json-format)
- [Example](#example)

## Installation

### CLI:

Global install to have the CLI accessible from everywhere on your operating system.
```bash
npm install -g turbo-json.js # install globaly
```

No installation needed when using `npx`.
```bash
npx turbo-json.js [options]
```

### Library:
```bash
# yarn
yarn add turbo-json.js

# npm
npm install turbo-json.js
```

## Usage

turbo-json.js takes one argument:

- Input directory: the path to the directory containing all the jsons.

and options:
- Output file _optional_ : path to the output file (default: `combined.json`).
- Validate Input JSON's: All input JSON files are validated to be a correct [JSON](https://www.json.org/json-en.html) (default: `true`).
- Validate Output JSON's: Validate if the outputed JSON is a correct [JSON](https://www.json.org/json-en.html) (default: `false`).
- Quiet mode : no logs are outputed (default: `false`)

It accepts relative path but also fully qualified paths.

### CLI usage:

Usage:
```bash
turbo-json [options] <input-directory>
```

Options:
```
  -o, --output-file <file-name>      File name in which all the json files will be merged (default: "combined.json")
  -I, --validate-input <file-name>   Check if input JSON files are valid (default: true)
  -O, --validate-output <file-name>  Check if output JSON is a valid JSON (default: false)
  -q, --quiet                        Quiet mode, no logs are outputed (default: false)
```

**Example**
```bash
turbo-json /data -o combined_data.json
```

### Library usage


```js
const { combineJson } = require('./src');

(async () => {
  await combineJson('misc', { outputFile: 'combined_data.json', validateInput: true, validateOutput: false, quiet: false });
})();
```


## How is it combined

The tool requires the path to a directory to work. Inside that directory all json files are read and merged into one big json file.

The JSON file outputed by this tool contains an array with all the inputed JSON files.

**Example:**

If your JSON file contained `{ "id": 1 }` it will be stored in the output file like this `[{"id": 1}]`

Some examples:

Input files:
```json
{ "id": 1 }
```
```json
{ "id": 2 }
```

Output file:
```json
[
  { "id": 1 },
  { "id": 2 }
]
```

**Array exception**:
There is one exception to this rule. If your JSON file contains an array, it will be deconstructed/flattened in the final file (_could become an option please make an issue if you'd like that_).

Input files:

```json
[ 1, 2, 3 ]
```

```json
{ "id": 1 }
```

Output file:

```json
[
  1,
  2,
  3,
  { "id": 1 }
]
```


## Validate Json Format

By default the tool supposes that your JSON files are correctly formated. If you'd like to check if it is well formated before concatenation the `validateInput` options should be set to true.
By doing so, only the well formated JSON's are concatenated but this comes at the price that every file will be stream-read two times. Once for validation and once for writing.

The same is possible to validate the output file using `validateOutput`.

Validity is based on the description provided by [json.org](https://www.json.org/json-en.html).

## Example

Using the JSON files present in `misc`, you can observe the outputed file [misc_output.json](./misc_output.json)

At the root of the repository use the following:

```bash
npx turbo-json misc
```

it will generate a combined.json file with all the JSON objects found in misc.
