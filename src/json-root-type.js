const fs = require('fs')

function findClosingArrayIndex({ fd, buffer, position }) {
  let nbCharsRead = fs.readSync(fd, buffer, 0, buffer.length, position)

  // Recursive end condition
  if (nbCharsRead === 0) return null

  let sequence = [...buffer].map(char => String.fromCharCode(char))
  let closingBracketPos = sequence.lastIndexOf(']')

  // if closing bracket is found
  if (closingBracketPos > -1) return position + closingBracketPos - 1

  // if no closing bracket is found, continue recursion with position -8
  return findClosingArrayIndex({
    fd,
    position: position - buffer.length,
    buffer,
  })
}

function closingArrayIndex({ fd, position, bufferSize = 1000 }) {
  let buffer = new Int8Array(bufferSize)

  return findClosingArrayIndex({ fd, buffer, position })
}

function findFirstNoneWhiteSpaceChar({ fd, buffer, position }) {
  // seek
  let nbCharsRead = fs.readSync(fd, buffer, 0, buffer.length)

  // Recursive end condition
  if (nbCharsRead === 0)
    return {
      empty: true,
      isArray: false,
      typeIndex: 0,
    }

  let sequence = [...buffer].map(char => String.fromCharCode(char))
  const noneWhiteSpace = sequence.find(char => !char.match(/\s/g))

  if (noneWhiteSpace) {
    const bracketOffset = noneWhiteSpace === '[' ? 1 : 0
    return {
      isArray: !!bracketOffset,
      startPosition:
        position + sequence.indexOf(noneWhiteSpace) + bracketOffset,
      empty: false,
    }
  }
  return findFirstNoneWhiteSpaceChar({
    fd,
    buffer,
    position: position + buffer.length,
  })
}

function jsonRootType({ fd, bufferSize = 1000 }) {
  let buffer = new Int8Array(bufferSize)
  return findFirstNoneWhiteSpaceChar({ fd, buffer, position: 0 })
}

module.exports = {
  jsonRootType,
  closingArrayIndex,
}
