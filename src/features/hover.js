const { createRPCMethod } = require('../router');

const createHoverFeature = (hoverHandler) => {
  const hoverMethod = createRPCMethod('textDocument/hover', async ({ textDocument: { uri }, position }) => {
    const value = await hoverHandler(uri, position);
    return {
      contents: {
        kind: 'plaintext',
        value,
      }
    };
  });

  const getCapabilities = () => {
    return {
      hoverProvider: !!hoverHandler,
    };
  };

  const getMethods = () => {
    if (getCapabilities().hoverProvider)
      return [hoverMethod];
    return [];
  };

  return {
    getMethods,
    getCapabilities,
  };
};

module.exports = {
  createHoverFeature,
};