const { createHeaderReader } = require('./protocol/headerReader');

const createBaseProtocolReader = (onMessage) => {
  const headerReader = createBaseProtocolHeaderReader();
  const bodyReader = createBaseProtocolBodyReader();

  let readingState = 'header';
  let headers = null;
  let body = null

  const readChunk = (chunk) => {
    switch (readingState) {
      case 'header':
        const chunkContents = headerReader.readChunk(chunk);
        if (chunkContents) {
          const { headersInChunk, restOfChunk } = chunkContents;
          readingState = 'body';
          return readChunk(restOfChunk)
        }
      case 'body':

    }
    if (readingState === 'header') {
    }
  };

  return {
    readChunk,
  }
};

const createProtocolReader = () => {
  const read = () => {
    return [];
  };

  return {
    read,
  };
};

module.exports = {
  createProtocolReader,
};
