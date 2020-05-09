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
      const onKeyPress = () => {
        process.stdin.on('off', onKeyPress);
        res();
      }
      process.stdin.on('keypress', onKeyPress);
    });
    process.stdin.setRawMode(false);
    process.stdin.pause();
  
    console.log('Closing Server');
  
    await baconLanguageServer.close();
  } catch (error) {
    console.error(error);
  }
};

createCLI(...process.argv);