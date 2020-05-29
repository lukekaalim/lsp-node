const createTextDocumentService = () => {
  // map of TextDocumentItem by their URI
  // https://microsoft.github.io/language-server-protocol/specifications/specification-current/#textDocumentItem
  const openDocuments = new Map();

  const didOpenNotification = createRPCNotification('textDocument/didOpen', notification => {
    const { textDocument } = notification;

    openDocuments.add(textDocument.uri, textDocument);
  });

  const didChangeNotification = createRPCNotification('textDocument/change', notification => {

  });

  
  return {

  };
};

module.exports = {
  createTextDocumentService,
};
