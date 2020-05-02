const createBodyReader = () => {
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
    prepare,
  };
};