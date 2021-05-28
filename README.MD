# Combine-json

Combine-json is a CLI tool that combines all json files found in a directory into one big json file using streaming to avoid out-of-memory.

The output JSON file contains an array with all the inputed JSON files.
So if your JSON file contained `{ "id": 1 }` it will be stored in the output file like this:

Input files:

file 1:
```json
{ "id": 1 }
```

file 2:
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
There is one exception to this rule. If your JSON file contains an array, it will be deconstructed in the final file (_could become an option please make an issue if you'd like that_).

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


## Installation

CLI:

```bash
npx combine-json [options]
```

Library:

```bash
# yarn
yarn add combine-json

# npm
npm install combine-json
```


## Usage

Combine-json has two options:

- Input dir: the path to the directory containing all the jsons.
- Output file _optional_: path to the output file.

It accepts relative path but also fully qualified paths.

### CLI usage:

```bash
combine-json --input-dir <dir-path> --output-file <file-path> (default: "combined.json")
```

**Example**
```bash
combine-json /data combined_data.json
```

### Library usage

```js
const { combineJson } = require('./src');

(async () => {
  await combineJson({ inputDir: 'misc', outputFile: 'combined_data.json' });
})();
```

### Example

Using the JSON files present in `misc`, you can observe the outputed file [misc_output.json](./misc_output.json)

## Try it out

At the root of the repository use the following:

```bash
npx combine-json misc
```

it will generate a combined.json file with all the JSON objects found in misc.
