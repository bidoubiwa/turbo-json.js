const combineJson = require('../src/combine-json');
const fs = require('fs');
const rimraf = require('rimraf');

const OUTPUT_DIR = 'test-output';

beforeAll(() => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }
});
// doesnt work with one file
test('Tests on 1 empty file', async () => {
  const res = await combineJson(
    'misc/one_empty',
    'test-output/combine_empty.json'
  );

  const data = JSON.parse(
    fs.readFileSync(`${process.cwd()}/test-output/combine_empty.json`, 'utf-8')
  );
  const expected = [];
  expect(res).toBe(1);
  expect(data).toEqual(expected);
});

test('Tests on multiple empty files', async () => {
  const res = await combineJson(
    'misc/multiple_empty',
    'test-output/combine_multiple_empty.json'
  );
  const data = JSON.parse(
    fs.readFileSync(
      `${process.cwd()}/test-output/combine_multiple_empty.json`,
      'utf-8'
    )
  );
  const expected = [];
  expect(res).toBe(1);
  expect(data).toEqual(expected);
});

test('Tests if on 1 file containing one primitive', async () => {
  const res = await combineJson(
    'misc/one_primitive',
    'test-output/combine_a_single_primitive.json'
  );
  const data = JSON.parse(
    fs.readFileSync(`${process.cwd()}/test-output/combine_a_single_primitive.json`, 'utf-8')
  );
  const expected = [1];
  expect(res).toBe(1);
  expect(data).toEqual(expected);
});

test('Tests if on 1 files', async () => {
  const res = await combineJson(
    'misc/one_file',
    'test-output/combine_one.json'
  );
  const data = JSON.parse(
    fs.readFileSync(`${process.cwd()}/test-output/combine_one.json`, 'utf-8')
  );
  const expected = [{ name: 'Hello' }, { name: 'Hello' }, { name: 'Hello' }];
  expect(res).toBe(1);
  expect(data).toEqual(expected);
});

test('Tests if on all files', async () => {
  const res = await combineJson('misc', 'test-output/combine_all.json');
  const data = JSON.parse(
    fs.readFileSync(`${process.cwd()}/test-output/combine_all.json`, 'utf-8')
  );
  const expected = require('./assets/combine_all.json');
  expect(res).toBe(1);
  expect(data).toEqual(expected);
});

afterAll(() => {
  if (fs.existsSync(OUTPUT_DIR)) {
    rimraf.sync(OUTPUT_DIR);
  }
});
