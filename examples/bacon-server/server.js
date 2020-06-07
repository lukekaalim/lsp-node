const { createLanguageServer, indexToPosition, positionToIndex } = require('../../');
const readline = require('readline');

const baconRegex = /\b(bacon)\b/gi;

const isBacon = (text, index) => {
  const baconMatches = [...text.matchAll(baconRegex)];
  const baconMatchIndices = baconMatches.map(match => match.index);
  
  return baconMatchIndices.find(baconIndex => {
    const baconStartIndex = baconIndex;
    const baconEndIndex = baconIndex + 'bacon'.length;

    return index >= baconStartIndex && index <= baconEndIndex;
  });
};

const createServer = async () => {
  const baconLanguageServer = createLanguageServer('bacon', '1.0.0', (rootUri, { documentService }) => {
    
    const hoverHandler = async (uri, position) => {
      const document = await documentService.getDocument(uri);
      const isPositionBacon = isBacon(document.text, positionToIndex(document.text, position));
      if (isPositionBacon)
        return `BACON DETECTED`;
      return `No bacon here`;
    };

    return {
      hoverHandler,
    };
  });
  await baconLanguageServer.listen(6543);
  return baconLanguageServer;
}

const main = async () => {
  try {
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY)
      process.stdin.setRawMode(true);
  
    const server = await createServer();
    console.log('Press any key to stop listening', 6543);
  
    await new Promise(res => process.stdin.on('keypress', res));
    process.stdin.pause();
    await server.close();
    console.log('Shut down server');
  } catch (error) {
    console.error(error);
  }
};

main();