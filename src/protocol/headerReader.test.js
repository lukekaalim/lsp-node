const { assert } = require('@lukekaalim/test');
const { chunkify } = require('./chunk.utils.test');

const { createHeaderReader } = require('./headerReader');

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

// Tests

const testSingleHeader = (reader) => {
  const extraData = 'abcdefg';
  const headerContent = createHeaderFromFields('Content-Length: 100') + extraData;
  const chunk = Buffer.from(headerContent, 'ascii');
  const { headers, headerTerminationIndex } = reader.readChunk(chunk);

  return assert('The reader reads the headers of a continuous single-field header', [
    assertHeaderContains(headers, 'Content-Length', '100'),
    assert(
      'Reader marks on the result where the header terminates',
      chunk.toString('ascii').slice(headerTerminationIndex + 4) === extraData
    )
  ]);
};

const testChunkedHeader = (reader) => {
  const headerContent = createHeaderFromFields('Content-Length: 100', 'Content-Type: utf-8', 'Origin: http://localhost');
  const chunks = chunkify(headerContent, headerContent.length * 2)
    .map(content => Buffer.from(content, 'ascii'));

    let result;
    for (const chunk of chunks) {
      result = reader.readChunk(chunk) || result;
    }

  return assert(`The reader reads the headers of a ${chunks.length} chunked multiple-field header`, [
    assertHeaderContains(result.headers, 'Content-Length', '100'),
    assertHeaderContains(result.headers, 'Content-Type', 'utf-8'),
    assertHeaderContains(result.headers, 'Origin', 'http://localhost'),
  ]);
};

// Orchestrator

const testHeaderReader = () => {
  return assert('protocol/headerReader.js exports a constructor that creates a LSP header reader', [
    testSingleHeader(createHeaderReader()),
    testChunkedHeader(createHeaderReader())
  ]);
};

module.exports = {
  testHeaderReader,
}