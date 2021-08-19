const combineJson = require('../src/combine-json');
const fs = require('fs');
const rimraf = require('rimraf');

const OUTPUT_DIR = 'test-output';

beforeAll(() => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }
});

test('Tests on 1 empty file', async () => {
  const res = await combineJson({
    inputDir: 'misc/one_empty',
    outputFile: 'test-output/combine_empty.json',
  });

  const data = JSON.parse(
    fs.readFileSync(`${process.cwd()}/test-output/combine_empty.json`, 'utf-8')
  );
  const expected = [];
  expect(res).toBe(1);
  expect(data).toEqual(expected);
});

test('Tests on multiple empty files', async () => {
  const res = await combineJson({
    inputDir: 'misc/multiple_empty',
    outputFile: 'test-output/combine_multiple_empty.json',
  });
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

test.only('Tests on some invalid files and some valid', async () => {
  const res = await combineJson({
    inputDir: 'misc/multiple_empty',
    outputFile: 'test-output/combine_multiple_empty.json',
  });
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
  const res = await combineJson({
    inputDir: 'misc/one_primitive',
    outputFile: 'test-output/combine_a_single_primitive.json',
  });
  const data = JSON.parse(
    fs.readFileSync(
      `${process.cwd()}/test-output/combine_a_single_primitive.json`,
      'utf-8'
    )
  );
  const expected = [1];
  expect(res).toBe(1);
  expect(data).toEqual(expected);
});

test('Tests if on 1 files', async () => {
  const res = await combineJson({
    inputDir: 'misc/one_file',
    outputFile: 'test-output/combine_one.json',
  });
  const data = JSON.parse(
    fs.readFileSync(`${process.cwd()}/test-output/combine_one.json`, 'utf-8')
  );
  const expected = [{ name: 'Hello' }, { name: 'Hello' }, { name: 'Hello' }];
  expect(res).toBe(1);
  expect(data).toEqual(expected);
});

test('Tests on 3 array', async () => {
  const res = await combineJson({
    inputDir: 'misc/array_test',
    outputFile: 'test-output/combine_array.json',
  });
  const data = JSON.parse(
    fs.readFileSync(`${process.cwd()}/test-output/combine_array.json`, 'utf-8')
  );
  const expected = [{ name: 'far away' }, { name: 'far away and behind' }, 1, 2, 3];
  expect(res).toBe(1);
  expect(data).toEqual(expected);
});

test('Tests if on all files', async () => {
  const res = await combineJson({
    inputDir: 'misc',
    outputFile: 'test-output/combine_all.json',
  });
  const data = JSON.parse(
    fs.readFileSync(`${process.cwd()}/test-output/combine_all.json`, 'utf-8')
  );
  const expected = require('./assets/combine_all.json');
  expect(res).toBe(1);
  expect(data).toEqual(expected);
});

afterAll(() => {
  if (fs.existsSync(OUTPUT_DIR)) {
    // rimraf.sync(OUTPUT_DIR);
  }
});
