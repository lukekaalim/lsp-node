const { assert } = require('@lukekaalim/test');
const { chunkify } = require('./chunk.utils.test');

const { createBodyReader } = require('./bodyReader');

const assertEquals = (a, b, aName = JSON.stringify(a), bName = JSON.stringify(b)) => {
  return assert(`${aName} === ${bName}`, a === b);
};

const assertReaderParsesUnchunkedBuffer = (reader) => {
  const chunk = Buffer.from('A cool and single chunk', 'utf-8');
  const bytesToRead = chunk.length;

  reader.prepare(bytesToRead);
  const result = reader.readChunk(chunk);

  return assert('Reader returns a result when given a single chunk the length prepared for', [
    assert('Result is not null', result !== null),
    assert('Result termination index is the length of the chunk', [assertEquals(result.bodyTerminationIndex, chunk.length)]),
    assert('Result is a buffer containing chunked data', [assertEquals(result.bodyContentBuffer.toString('utf-8'), 'A cool and single chunk')])
  ]);
};

const assertReaderParsesChunkedBuffer = (reader) => {
  const content = 'A cool multi-chunk message';
  const chunks = chunkify(content, 5).map(content => Buffer.from(content, 'utf-8'));
  const bytesToRead = chunks.map(chunk => chunk.length).reduce((a, b) => a + b, 0);
  let finalResult;

  reader.prepare(bytesToRead);
  for (const chunk of chunks) {
    finalResult = reader.readChunk(chunk);
  }

  return assert('Reader returns a result when given multiple chunks up to the length prepared for', [
    assert('Result is not null', finalResult !== null),
    assert('Result is a buffer containing chunked data', [
      assertEquals(finalResult.bodyContentBuffer.toString('utf-8'), 'A cool multi-chunk message'),
    ]),
  ]);
};

const assertReaderReturnsNullOnIncompleteBuffer = (reader) => {
  const chunk = Buffer.from('A cool and single chunk', 'utf-8');
  const bytesToRead = chunk.length + 50;

  reader.prepare(bytesToRead);
  const result = reader.readChunk(chunk);

  return assert('Reader returns a null result when given a chunk that is not the prepared length', [
    assertEquals(result, null),
  ])
};

const testBodyReader = () => {
  return assert('protocol/bodyReader.js exports a constructor that creates a LSP body reader', [
    assertReaderParsesUnchunkedBuffer(createBodyReader()),
    assertReaderParsesChunkedBuffer(createBodyReader()),
    assertReaderReturnsNullOnIncompleteBuffer(createBodyReader())
  ]);
};

module.exports = {
  testBodyReader,
};