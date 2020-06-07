const net = require('net');
const { connectSocketToRouter } = require('./rpc.js');
const { createAsyncInitializationRouter, createBasicRPCRouter } = require('./router.js');
const { createDocumentService } = require('./services/document');
const { createInitializeService } = require('./services/initialize');
const { createHoverFeature } = require('./features/hover');

const createServerRouter = (name, version, getFeatureHandlers) => async ({ rootUri, processId, clientInfo, capabilities: clientCapabilities }) => {
  const documentService = createDocumentService();
  const initializeService = createInitializeService();

  const services = {
    documentService,
  };

  const { hoverHandler } = await getFeatureHandlers(rootUri, services);

  const hoverService = createHoverFeature(hoverHandler);
  const methods = [
    ...hoverService.getMethods(),
  ];
  const notifications = [
    ...documentService.getNotifications(),
    ...initializeService.getNotifications(),
  ];
  const defaultHandler = (id, params) => {
    console.log(id, params);
    throw new Error(`Whoops default handler.`);
  };
  const router = createBasicRPCRouter(methods, notifications, defaultHandler);
  const capabilities = {
    ...documentService.getCapabilities(),
    ...hoverService.getCapabilities(),
  };
  const serverInfo = {
    name,
    version,
  };
  return {
    router,
    capabilities,
    serverInfo,
  };
};

const createLanguageServer = (name, version, getFeatureHandlers) => {
  const netServer = net.createServer();

  netServer.on('connection', (socket) => {
    const routerConstructor = createServerRouter(name, version, getFeatureHandlers);
    const router = createAsyncInitializationRouter(routerConstructor);
    connectSocketToRouter(socket, router);
  });

  netServer.on('error', (err) => {
    console.error(err);
  });

  const listen = async (port) => {
    return new Promise(res => netServer.listen(port, () => res()));
  };
  const close = async () => {
    return new Promise(res => netServer.close(() => res()));
  };

  return {
    listen,
    close,
  };
};

module.exports = {
  createLanguageServer,
};
