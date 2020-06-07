const EventEmitter = require('events');
const { createEditorDocumentService } = require('./document/editorDocument');
const { createFileDocumentService } = require('./document/fileDocument');

const createDocumentService = () => {
  const documentEmitter = new EventEmitter();
  const editorDocumentService = createEditorDocumentService();
  const fileDocumentService = createFileDocumentService();

  editorDocumentService.editorDocumentEmitter.on('change', () => {
    documentEmitter.emit('change');
  });

  const getDocument = async (documentURI) => {
    // an in-memory representation of an existing document
    const editorDocument = editorDocumentService.getDocument(documentURI);
    if (editorDocument)
      return editorDocument;

    // https://microsoft.github.io/language-server-protocol/specifications/specification-current/#uri
    const { pathname: path, host: authority, protocol: scheme } = new URL(uri);
    if (scheme === 'file')
      return await fileDocumentService.getDocument(path);
    throw new Error(`Can\'t parse this file schema: ${uri}`);
  };

  const getNotifications = () => {
    return editorDocumentService.getNotifications();
  };

  const getCapabilities = () => {
    return {
      textDocumentSync: {
        openClose: true,
        change: 1,
        willSave: false,
        willSaveWaitUntil: false,
        save: false,
      }
    };
  };

  return {
    documentEmitter,
    getDocument,
    getNotifications,
    getCapabilities,
  };
};

module.exports = {
  createDocumentService,
};
