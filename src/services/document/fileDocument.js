const fs = require('fs');

const createFileDocumentService = () => {
  const getDocument = async (filePath) => {
    console.log('reading file', filePath);
    return await fs.promises.readFile(filePath);
  };

  return {
    getDocument,
  };
};

module.exports = {
  createFileDocumentService,
};