const net = require('net');
const { promisify } = require('util');
const { connectSocketToRouter } = require('./rpc.js');
const { createAsyncInitializationRouter, createBasicRPCRouter, createRPCMethod } = require('./router.js');

const createServerRouter = async () => {
  const methods = [
  ];
  const notifications = [
  ];
  const defaultHandler = () => {
    throw new Error();
  };
  const router = createBasicRPCRouter(methods, notifications, defaultHandler);
  const capabilities = {

  };
  const serverInfo = {
    
  };
  return {
    router,
    capabilities,
    serverInfo,
  };
};

const createLanguageServer = (name, version) => {
  const netServer = net.createServer();

  server.on('connection', (socket) => {
    connectSocketToRouter(socket, createAsyncInitializationRouter(createServerRouter))
  });

  netServer.on('error', (err) => {
    console.error(err);
  });

  const listen = promisify(netServer.listen);
  const close = promisify(netServer.close);

  return {
    listen,
    close,
  };
};

module.exports = {
  createLanguageServer,
};
