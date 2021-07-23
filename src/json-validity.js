const fs = require('fs');
const Verifier = require('stream-json/utils/Verifier');


async function verifyJson({ jsonFile }) {

  const verifier = new Verifier();

  verifier.on('error', error => {
    console.log(error)
    throw `Json file is not valid: ${jsonFile}`
  });

  const verifierStream = fs.createReadStream(jsonFile).pipe(verifier);
  await new Promise(function (resolve) {
    verifierStream.on('close', function () {
      resolve();
    });
  });
}

module.exports = { verifyJson }
