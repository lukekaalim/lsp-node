const { createHeaderReader } = require('./protocol/headerReader');
const { createBodyReader } = require('./protocol/bodyReader');

const createProtocolReader = () => {
  const headerReader = createHeaderReader();
  const bodyReader = createBodyReader();
  let headers = null;
  let body = null;

  headerReader.prepare();
  bodyReader.prepare(0);

  let readerState = 'reading-headers';

  const readHeaderChunk = (chunk) => {
    const result = headerReader.readChunk(chunk);
    if (result === null) {
      return [];
    } else {
      headers = result.headers;
      readerState = 'reading-body';
      bodyReader.prepare(parseInt(headers['content-length'], 10));
      return readChunk(chunk.slice(result.headerTerminationIndex));
    }
  };

  const readBodyChunk = (chunk) => {
    const result = bodyReader.readChunk(chunk);
    if (result === null) {
      return [];
    } else {
      body = result.bodyContentBuffer;
      readerState = 'reading-headers';
      headerReader.prepare();
      return [{ body, headers } ,...readChunk(chunk.slice(result.bodyTerminationIndex))];
    }
  };

  const readChunk = (chunk) => {
    switch (readerState) {
      case 'reading-headers':
        return readHeaderChunk(chunk);
      case 'reading-body':
        return readBodyChunk(chunk);
    }
  };

  return {
    readChunk,
  };
};

module.exports = {
  createProtocolReader,
};
