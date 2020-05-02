const parseHeaders = (headersChunk) => {
  const headers = {};
  for (const headerLine of headersChunk.split('\r\n')) {
    const [property, value] = headerLine.split(': ', 2);
    headers[property] = value;
  }
  return headers;
};

class HeaderTerminatedError extends Error {
  constructor() {
    super([
      `Attempted to continue reading chunks even though header terminated.`,
      `Consider calling prepare() to start a new header.`
    ].join(''))
  }
};

const createHeaderReader = () => {
  let unterminatedReadChunks = '';
  let completedHeader = false;

  const readChunk = (chunk) => {
    if (completedHeader)
      throw new HeaderTerminatedError();

    const chunkAsString = chunk.toString('ascii');
    const combinedChunk = unterminatedReadChunks + chunkAsString;
    const headerTerminationIndex = combinedChunk.indexOf('\r\n\r\n');

    if (headerTerminationIndex === -1) {
      unterminatedReadChunks = combinedChunk;
      return null;
    }

    const headersChunk = combinedChunk.slice(0, headerTerminationIndex);
    const headers = parseHeaders(headersChunk);

    return { headers, headerTerminationIndex };
  };

  const prepare = () => {
    unterminatedReadChunks = '';
  };

  return {
    readChunk,
    prepare,
  };
};

module.exports = {
  createHeaderReader,
  HeaderTerminatedError,
};
