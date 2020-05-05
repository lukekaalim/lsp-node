const { assert } = require('@lukekaalim/test');
const { chunkify } = require('./chunk.utils.test');

const { createHeaderReader, HeaderTerminatedError } = require('./headerReader');

// Test Utils

const createHeaderFromFields = (...fields) => {
  return fields.join('\r\n') + '\r\n\r\n';
};

const assertHeaderContains = (headers, expectedName, expectedValue) => {
  const pass = headers[expectedName] === expectedValue;

  const passMessage = `The headers should contain the field "${expectedName}" with a value of "${expectedValue}"`;
  const failMessage = `${passMessage} (but was instead "${headers[expectedName]}")`;

  return assert(pass ? passMessage : failMessage, pass);
};

const assertThrows = (functionToThrow, expectedErrorConstructor = Error) => {
  try {
    functionToThrow();
    return assert(`The provided function should throw an error (But it did not)`, false);
  } catch (error) {
    if (error instanceof expectedErrorConstructor)
      return assert(`The provided function should throw an error`, true);

    return assert(`The provided function should throw an error (But it threw the wrong kind of error)`, false);
  };
};

// Tests

const testSingleHeader = (reader) => {
  const extraData = 'abcdefg';
  const headerContent = createHeaderFromFields('Content-Length: 100') + extraData;
  const chunk = Buffer.from(headerContent, 'ascii');
  const { headers, headerTerminationIndex } = reader.readChunk(chunk);

  return assert('The reader reads the headers of a continuous single-field header', [
    assertHeaderContains(headers, 'content-length', '100'),
    assert(
      'Reader marks on the result where the header terminates',
      chunk.toString('ascii').slice(headerTerminationIndex) === extraData
    )
  ]);
};

const testChunkedHeader = (reader) => {
  const headerContent = createHeaderFromFields('Content-Length: 100', 'Content-Type: utf-8', 'Origin: http://localhost');
  const chunks = chunkify(headerContent, headerContent.length * 2)
    .map(content => Buffer.from(content, 'ascii'));

    let result;
    for (const chunk of chunks) {
      result = reader.readChunk(chunk);
    }

  return assert(`The reader reads the headers of a ${chunks.length} chunked multiple-field header`, [
    assertHeaderContains(result.headers, 'content-length', '100'),
    assertHeaderContains(result.headers, 'content-type', 'utf-8'),
    assertHeaderContains(result.headers, 'origin', 'http://localhost'),
  ]);
};

const testTerminationError = (reader) => {
  const headerContent = createHeaderFromFields('Content-Length: 100');
  const chunk = Buffer.from(headerContent, 'ascii');

  reader.readChunk(chunk);

  return assert(`The reader should throw an error it is asked to read another chunk after terminating without being reset`, [
    assertThrows(() => reader.readChunk('excess data'), HeaderTerminatedError)
  ]);
};

// Orchestrator

const testHeaderReader = () => {
  return assert('protocol/headerReader.js exports a constructor that creates a LSP header reader', [
    testSingleHeader(createHeaderReader()),
    testChunkedHeader(createHeaderReader()),
    testTerminationError(createHeaderReader())
  ]);
};

module.exports = {
  testHeaderReader,
}