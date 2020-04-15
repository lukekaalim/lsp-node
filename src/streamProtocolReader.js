const readingStates = {
  readingHeader: 0,
  readingBody: 1,
};

const createHeaderReader = () => {

};

const createStreamProtocolReader = (readableStream, onMessage) => {
  let readingState = readingStates.readingHeader;
  let headers = null;
  let body = null;
  
  let pendingChunks = [];

  const readHeader = () => {

  };

  const readBody = () => {

  };

  const onStreamData = (data) => {
    switch (readingState) {
      case readingStates.readingHeader:

      case readingStates.readingBody:
    }
  };

  readableStream.addListener('data', onStreamData);

  const close = () => {
    readableStream.removeListener('data', onStreamData);
  };

  return {
    close,
  };
};