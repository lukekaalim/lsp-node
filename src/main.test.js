const { assert, colorReporter } = require('@lukekaalim/test');
const package = require('../');

const { testLanguageServer } = require('./languageServer.test.js');
const { testLSPProtocol } = require('./protocol.test');

const testMainExports = async () => {
  return assert('The main package exports a function that can create a LSP server', [
    assert('There is a function called "createLanguageServer" in the package exports', typeof package.createLanguageServer === 'function'),
    assert('The export "createLanguageServer" creates a language server', [
      await testLanguageServer(package.createLanguageServer),
    ])
  ]);
};

const test = async () => {
  console.clear();
  try {
    const assertion = assert('@lukekaalim/lsp-node is a package that can be used to create a Language Server', [
      await testMainExports(),
      testLSPProtocol(),
    ]);
    console.log(colorReporter(assertion));
  } catch (error) {
    console.error('There was an issue running the test suite:');
    console.error(error);
  }
};

test();