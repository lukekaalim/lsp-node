const parseHeaders = (headersChunk) => {
  const headers = {};
  for (const headerLine of headersChunk.split('\r\n')) {
    const [property, value] = headerLine.split(': ', 2);
    headers[property.toLowerCase()] = value;
  }
  return headers;
};

class HeaderTerminatedError extends Error {
  constructor() {
    super([
      `Attempted to continue reading chunks even though header terminated.`,
      `Consider calling prepare() to start a new header.`
    ].join('\n'))
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
    const combinedHeaderTerminationIndex = combinedChunk.indexOf('\r\n\r\n');

    if (combinedHeaderTerminationIndex === -1) {
      unterminatedReadChunks = combinedChunk;
      return null;
    }

    const headersChunk = combinedChunk.slice(0, combinedHeaderTerminationIndex);
    const localHeaderTerminationIndex = Math.max(0, combinedHeaderTerminationIndex - unterminatedReadChunks.length + 4);
    const headers = parseHeaders(headersChunk);
    completedHeader = true;

    return { headers, headerTerminationIndex: localHeaderTerminationIndex };
  };

  const prepare = () => {
    unterminatedReadChunks = '';
    completedHeader = false;
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
