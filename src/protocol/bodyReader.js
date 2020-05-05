class BodyTerminatedError extends Error {
  constructor() {
    super([
      `Attempted to continue reading chunks even though body terminated (or was not prepared).`,
      `Consider calling prepare() to start a new body.`
    ].join('\n'))
  }
};

const createBodyReader = () => {
  let bodyContentBuffer = null
  let bytesRead = 0;

  const readChunk = (chunk) => {
    if (bytesRead === bodyContentBuffer.length) {
      throw new BodyTerminatedError();
    }
    const chunkLength = chunk.length;
    // The total amount of bytes that we can read before we're 'done'.
    const unreadBytesForContent = bodyContentBuffer.length - bytesRead;

    const bytesToRead = Math.min(unreadBytesForContent, chunkLength);

    bytesRead += chunk.copy(bodyContentBuffer, bytesRead, 0, bytesToRead);

    if (bytesRead === bodyContentBuffer.length) {
      const bodyTerminationIndex = bytesToRead;
      return { bodyContentBuffer, bodyTerminationIndex };
    }

    return null;
  };

  const prepare = (bytesToRead) => {
    bodyContentBuffer = Buffer.alloc(bytesToRead);
    bytesRead = 0;
  };

  return {
    readChunk,
    prepare,
  };
};

module.exports = {
  createBodyReader,
  BodyTerminatedError,
};