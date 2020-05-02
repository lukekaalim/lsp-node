const chunkify = (content, chunkCount) => {
  const chunks = [];
  const contentLength = content.length;
  const chunkSize = contentLength / chunkCount;
  for (let i = 0; i < chunkCount; i++) {
    chunks[i] = content.slice(Math.floor(i * chunkSize), Math.floor((i * chunkSize) + chunkSize));
  }
  return chunks;
};

module.exports = {
  chunkify,
};
