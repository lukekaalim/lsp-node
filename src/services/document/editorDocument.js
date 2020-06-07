const EventEmitter = require('events');

const { createLines, updateLines } = require('../../utils/lines');
const { createRPCNotification } = require('../../router');

/*
  Language Server Clients can mark certain documents as 'open', which means that
  their canonical contents are dictated by the clients. If a document is not open,
  it's canonical representation is the actual file.
*/
const createEditorDocumentService = () => {
  const editorDocumentEmitter = new EventEmitter();
  // map of TextDocumentItem by their URI
  // https://microsoft.github.io/language-server-protocol/specifications/specification-current/#textDocumentItem
  const openDocuments = new Map();

  const didOpenNotification = createRPCNotification('textDocument/didOpen', (notification) => {
    const { textDocument } = notification;
    const { uri } = textDocument;

    openDocuments.set(uri, textDocument);
  });

  // https://microsoft.github.io/language-server-protocol/specifications/specification-current/#textDocument_didChange
  const didChangeNotification = createRPCNotification('textDocument/didChange', (notification) => {
    const { textDocument, contentChanges } = notification;
    const { uri } = textDocument;

    for (const { text } of contentChanges) {
      const originalDocument = openDocuments.get(uri);
      openDocuments.set(uri, {
        ...originalDocument,
        text,
      });
    };

    editorDocumentEmitter.emit('change');
  });

  const didCloseNotification = createRPCNotification('textDocument/didClose', (notification) => {
    const { textDocument } = notification;
    const { uri } = textDocument;

    openDocuments.delete(uri);
  });

  const getNotifications = () => {
    return [didOpenNotification, didChangeNotification, didCloseNotification];
  };

  const getDocument = (documentUri) => {
    if (!openDocuments.has(documentUri))
      return null;
    return openDocuments.get(documentUri);
  };

  return {
    editorDocumentEmitter,
    getNotifications,
    getDocument,
  };
};

module.exports = {
  createEditorDocumentService,
};
