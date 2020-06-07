const { createProtocolReader, createProtocolMessage } = require('./protocol');

const connectSocketToRouter = (socket, router) => {
  const reader = createProtocolReader();
  const writeToSocket = async (data) => new Promise(resolve => socket.write(data, resolve));

  const messageQueue = [];

  const processQueue = async () => {
    if (messageQueue.length === 0)
      return;
  
    const incomingMessage = messageQueue[0];
    const request = JSON.parse(incomingMessage.body.toString('utf-8'));
    const response = await router.handleRequest(request);
    if (response) {
      const outgoingMessage = createProtocolMessage(JSON.stringify(response, null, 2));
      await writeToSocket(outgoingMessage);
    }

    messageQueue.shift();
    await processQueue();
  };

  const onSocketData = async (chunk) => {
    const messages = reader.readChunk(chunk);
    messageQueue.push(...messages);

    if (messageQueue.length - messages.length === 0)
      await processQueue();
  };

  const sendNotification = async (method, params) => {
    const notificationMessage = createProtocolMessage(JSON.stringify({ method, params }, null, 2));
    await writeToSocket(notificationMessage);
  };

  socket.on('data', onSocketData);

  const close = () => {
    socket.off('data', onSocketData);
  };

  return {
    sendNotification,
    messageQueue,
    close,
  };
};

module.exports = {
  connectSocketToRouter,
};