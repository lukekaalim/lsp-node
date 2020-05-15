const net = require('net');
const { createSocketRPCHandler, createRPCRouter, createRPCMethod } = require('./rpc.js');

const createLanguageServer = (name, version,) => {
  const router = createRPCRouter([
    createRPCMethod('initialize', () => ({
      capabilities: {},
      serverInfo: { name, version, }
    })),
    createRPCMethod('initialized', () => {
      console.log('Client notified initalized');
    }),
  ]);

  const netServer = net.createServer(socket => {
    const handler = createSocketRPCHandler(socket, router.handleRequest);
  });

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
