# `@lukekaalim/lsp-node`

A library to help you build a language server.

## Usage

```js
const { createLanguageServer } = require('@lukekaalim/lsp-node');

const getLanguageFeatures = (baseUri, services) => {
  const hoverHandler = async (uri, position) => {
    return 'My Hover Text';
  };

  return {
    hoverHandler,
  };
}

const languageServer = createLanguageServer(
  'myLanguageServer',
  '1.0.0',
  getLanguageFeatures
);

languageServer.listen();
```