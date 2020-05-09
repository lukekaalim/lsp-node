const net = require('net');
const { createRouter } = require('./server/router.js');

const createLanguageServer = (name, version) => {
  const router = createRouter();

  const netServer = net.createServer(router.onConnection);

  netServer.on('error', (err) => {
    console.error(err);
  });

  const listen = () => new Promise((resolve, reject) => {
    netServer.listen(6543, err => err ? reject(err) : resolve());
  });

  const close = () => new Promise((resolve, reject) => {
    netServer.close(err => err ? reject(err) : resolve())
  });

  return {
    listen,
    close,
  };
};

module.exports = {
  createLanguageServer,
};
