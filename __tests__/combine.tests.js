const combineJson = require('../src/combine-json')
const fs = require('fs')
const rimraf = require('rimraf')

const OUTPUT_DIR = 'test-output'

beforeAll(() => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR)
  }
})

test('Tests on 1 empty file', async () => {
  const res = await combineJson('misc/one_empty', {
    outputFile: 'test-output/combine_empty.json',
    validateInput: true,
    quiet: true,
  })

  const data = JSON.parse(
    fs.readFileSync(`${process.cwd()}/test-output/combine_empty.json`, 'utf-8')
  )
  const expected = []
  expect(res).toBe(1)
  expect(data).toEqual(expected)
})

test('Tests on 1 empty file', async () => {
  const res = await combineJson('misc/one_empty', {
    outputFile: 'test-output/combine_empty.json',
    validateInput: false,
    quiet: true,
  })

  const data = JSON.parse(
    fs.readFileSync(`${process.cwd()}/test-output/combine_empty.json`, 'utf-8')
  )
  const expected = []
  expect(res).toBe(1)
  expect(data).toEqual(expected)
})

test('Tests on multiple empty files', async () => {
  const res = await combineJson('misc/multiple_empty', {
    outputFile: 'test-output/combine_multiple_empty.json',
    validateInput: true,
    quiet: true,
  })
  const data = JSON.parse(
    fs.readFileSync(
      `${process.cwd()}/test-output/combine_multiple_empty.json`,
      'utf-8'
    )
  )
  const expected = []
  expect(res).toBe(1)
  expect(data).toEqual(expected)
})

test('Tests on some empty files and some valid', async () => {
  const res = await combineJson('misc/some_empty', {
    outputFile: 'test-output/combine_some_empty.json',
    validateInput: true,
    quiet: true,
  })
  const data = JSON.parse(
    fs.readFileSync(
      `${process.cwd()}/test-output/combine_some_empty.json`,
      'utf-8'
    )
  )
  const expected = [
    {
      name: 'far away',
    },
  ]
  expect(res).toBe(1)
  expect(data).toEqual(expected)
})

test('Tests on some invalid files and some valid', async () => {
  await combineJson('misc/some_non_valid', {
    outputFile: 'test-output/combine_some_non_valid.json',
    validateInput: false,
    quiet: true,
  })

  expect(() =>
    JSON.parse(
      fs.readFileSync(
        `${process.cwd()}/test-output/combine_some_non_valid.json`,
        'utf-8'
      )
    )
  ).toThrow()
})

test('Tests on some invalid files and some valid with no validation', async () => {
  await combineJson('misc/some_non_valid', {
    outputFile: 'test-output/combine_some_non_valid.json',
    validateInput: false,
    quiet: true,
  })

  expect(() =>
    JSON.parse(
      fs.readFileSync(
        `${process.cwd()}/test-output/combine_some_non_valid.json`,
        'utf-8'
      )
    )
  ).toThrow()
})

test('Tests on some invalid files and some valid with no validation, but validate output file', async () => {
  const res = await combineJson('misc/some_non_valid', {
    outputFile: 'test-output/failed.json',
    validateInput: false,
    validateOutput: true,
    quiet: true,
  }).catch(e => e)

  expect(res.error).toBe(
    'ERROR at 2 (2, 1): Verifier cannot parse input: expected a value'
  )
})

test('Tests on some empty files and some valid, validity check disabled', async () => {
  const res = await combineJson('misc/some_empty', {
    outputFile: 'test-output/combine_some_empty.json',
    validateInput: false,
    quiet: true,
  })
  const data = JSON.parse(
    fs.readFileSync(
      `${process.cwd()}/test-output/combine_some_empty.json`,
      'utf-8'
    )
  )

  const expected = [
    {
      name: 'far away',
    },
  ]
  expect(res).toBe(1)
  expect(data).toEqual(expected)
})

test('Tests if on 1 file containing one primitive', async () => {
  const res = await combineJson('misc/one_primitive', {
    outputFile: 'test-output/combine_a_single_primitive.json',
    quiet: true,
  })
  const data = JSON.parse(
    fs.readFileSync(
      `${process.cwd()}/test-output/combine_a_single_primitive.json`,
      'utf-8'
    )
  )
  const expected = [1]
  expect(res).toBe(1)
  expect(data).toEqual(expected)
})

test('Tests if on 1 files', async () => {
  const res = await combineJson('misc/one_file', {
    outputFile: 'test-output/combine_one.json',
    quiet: true,
  })
  const data = JSON.parse(
    fs.readFileSync(`${process.cwd()}/test-output/combine_one.json`, 'utf-8')
  )
  const expected = [{ name: 'Hello' }, { name: 'Hello' }, { name: 'Hello' }]
  expect(res).toBe(1)
  expect(data).toEqual(expected)
})

test('Tests on 3 array', async () => {
  const res = await combineJson('misc/array_test', {
    outputFile: 'test-output/combine_array.json',
    quiet: true,
  })
  const data = JSON.parse(
    fs.readFileSync(`${process.cwd()}/test-output/combine_array.json`, 'utf-8')
  )
  const expected = [
    { name: 'far away' },
    { name: 'far away and behind' },
    1,
    2,
    3,
  ]
  expect(res).toBe(1)
  expect(data).toEqual(expected)
})

test('Tests if on all files', async () => {
  const res = await combineJson('misc', {
    outputFile: 'test-output/combine_all.json',
    quiet: true,
  })
  const data = JSON.parse(
    fs.readFileSync(`${process.cwd()}/test-output/combine_all.json`, 'utf-8')
  )
  const expected = require('./assets/combine_all.json')
  expect(res).toBe(1)
  expect(data).toEqual(expected)
})

afterAll(() => {
  if (fs.existsSync(OUTPUT_DIR)) {
    rimraf.sync(OUTPUT_DIR)
  }
})
