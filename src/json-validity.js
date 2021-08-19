const { rejects } = require('assert');
const fs = require('fs');
const Verifier = require('stream-json/utils/Verifier');


async function verifyJson({ jsonFile }) {

  const verifier = new Verifier();

  const verifierStream = fs.createReadStream(jsonFile).pipe(verifier);
  await new Promise(function (resolve, rejects) {
    verifierStream.on('close', function () {
      resolve();
    });
    verifier.on('error', error => {
      rejects({message: `Json file is not valid: ${jsonFile}: ${error.message}`, file: jsonFile, error: error.message})
    });
  });
}

module.exports = { verifyJson }
