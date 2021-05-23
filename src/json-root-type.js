const fs = require('fs');

function findClosingArrayIndex({ filePath, fd, buffer, position }) {
  let nbCharsRead = fs.readSync(fd, buffer, 0, 8, position);

  // Recursive end condition
  if (nbCharsRead === 0) return null;
  let sequence = [...buffer].map((char) => String.fromCharCode(char));
  let closingBracketPos = sequence.lastIndexOf(']');
  if (closingBracketPos > -1) return position + closingBracketPos + 1;
  return findClosingArrayIndex({
    filePath,
    fd,
    position: position - 8,
    buffer,
  });
}

function closingArrayIndex({ filePath, fd, position }) {
  let buffer = new Int8Array(8);
  return findClosingArrayIndex({ filePath, fd, buffer, position });
}

function findFirstNoneWhiteSpaceChar({ fd, buffer, position, bufferSize }) {
  let nbCharsRead = fs.readSync(fd, buffer, 0, bufferSize);

  // Recursive end condition
  if (nbCharsRead === 0)
    return {
      empty: true,
      isArray: false,
      typeIndex: 0,
    };

  let sequence = [...buffer].map((char) => String.fromCharCode(char));
  const sec = sequence.find((char) => !char.match(/\s/g));

  if (sec) {
    return {
      isArray: sec === '[',
      typeIndex: position + sequence.indexOf(sec),
      empty: false,
    };
  }
  return findFirstNoneWhiteSpaceChar({
    fd,
    buffer,
    position: position + bufferSize,
    bufferSize,
  });
}

function jsonRootType({ fd, bufferSize }) {
  let buffer = new Int8Array(8);
  return findFirstNoneWhiteSpaceChar({ fd, buffer, position: 0, bufferSize });
}

module.exports = {
  jsonRootType,
  closingArrayIndex,
};
