const parseHeaders = (headersPartString) => headersPartString
  .split('\r\n')
  .map(headerString => {
    const [name, value] = headerString.split(': ');
    return { name, value };
  });

const createBaseProtocolHeaderReader = () => {
  let headerContent = '';

  const readChunk = (chunk) => {
    headerContent += chunk;

    const headerBreakIndex = headerContent.indexOf('\r\n\r\n');

    if (headerBreakIndex === -1)
      return null;
    
    const headersInChunk = parseHeaders(headerContent.slice(0, headerBreakIndex));
    const restOfChunk = headerContent.slice(headerBreakIndex + '\r\n\r\n'.length);

    return { headersInChunk, restOfChunk };
  };

  const reset = () => {
    headerContent = '';
  };

  return {
    readChunks,
    reset,
  };
};

const createBaseProtocolBodyReader = () => {
  let bodyContent = Buffer.from('');
  let bytesRead = 0;

  const setMaxBytesToRead = (bytesToRead) => {
    bodyContent = bytesToRead;
  };

  const readChunk = (chunk) => {
    bodyContent = Buffer.concat([bodyContent, chunk]);
  };

  const reset = () => {
    bodyContent = '';
    bytesRead = 0;
  };

  return {
    readChunk,
    reset,
  };
};

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

  const readHeaders = () => {

  };

  return {
    readChunk,
  }
};