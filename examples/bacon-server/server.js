const { createLanguageServer } = require('../../');
const readline = require('readline');

const createCLI = async (runtime, entrypoint, command) => {
  try {
    console.log(`runtime: ${runtime}, entrypoint: ${entrypoint}`);
  
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY)
      process.stdin.setRawMode(true);
  
    const baconLanguageServer = createLanguageServer('bacon', '1.0.0');
    await baconLanguageServer.listen();
  
    console.log('Press any key to stop listening', 6543);
  
    await new Promise(res => {
      process.stdin.on('keypress', res);
    });
    process.stdin.setRawMode(false);
    process.stdin.removeAllListeners();
  
    console.log('Closing Server');
  
    await baconLanguageServer.close();
  } catch (error) {
    console.error(error);
  }
};

const cli = createCLI(...process.argv);