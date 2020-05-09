const { assert } = require('@lukekaalim/test');

const assertDidntReject = async (promise, promiseName) => {
  try {
    await promise;
    return assert(`${promiseName} resolves it\'s promise`, true);
  } catch (error) {
    return assert(`${promiseName} resolves it\'s promise`, false);
  }
}

const testLSPShutdown = async (createLanguageServer) => {
  const serverToClose = createLanguageServer();
  await serverToClose.listen();

  return assert('The server has a shutdown function that closes all connections', [
    await assertDidntReject(serverToClose.close(), 'serverToClose.close()'),
  ]);
};

const testLanguageServer = async (createLanguageServer) => {
  return assert('createLanguageServer() returns a language server', [
    await testLSPShutdown(createLanguageServer),
  ]);
};

module.exports = {
  testLanguageServer,
};
