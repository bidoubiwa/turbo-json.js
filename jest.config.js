// jest.config.js
// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
}

module.exports = config

// Or async function
module.exports = async () => {
  return {
    verbose: true,
    watchPathIgnorePatterns: ['<rootDir>/test-output'],
    rootDir: '.',
    testEnvironment: 'node',
  }
}
