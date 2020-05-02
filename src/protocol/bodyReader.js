const createBodyReader = () => {
  let bodyContent = null
  let bytesRead = 0;

  const readChunk = (chunk) => {
    if ()
    bodyContent = Buffer.concat([bodyContent, chunk]);
  };

  const prepare = (bytesToRead) => {
    
  };

  return {
    readChunk,
    prepare,
  };
};