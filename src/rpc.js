const { v4: uuid } = require('uuid');
const { createProtocolReader, createProtocolMessage } = require('./protocol');

const createRPCMethod = (methodName, methodHandler) => {
  return {
    methodName,
    methodHandler,
  };
};

class RPCResponseError extends Error {
  code;
  message;
  data;
  constructor(errorCode = -32001, errorMessage = 'An unhandled error was thrown', errorData = null) {
    super(errorMessage);
    this.code = errorCode;
    this.message = errorMessage;
    this.data = errorData;
  }
}

const createRPCRouter = (rpcMethods) => {
  const methodNameMap = new Map(rpcMethods.map(method => [method.methodName, method.methodHandler]));

  const handleRequest = async (request) => {
    if (methodNameMap.has(request.method)) {
      const handler = methodNameMap.get(request.method);
      try {
        const result = await handler(request.id, request.params);
        if (!result)
          return null;
        return { id: uuid(), result };
      } catch (error) {
        if (error instanceof RPCResponseError) {
          return { id: uuid(), error };
        }
        return { id: uuid(), error: new RPCResponseError() };
      }
    }
    return { id: uuid(), error: new RPCResponseError() };
  };

  return {
    handleRequest,
  };
};

const createSocketRPCHandler = (socket, requestHandler) => {
  const reader = createProtocolReader();
  const writeToSocket = async (data) => new Promise(resolve => socket.write(data, resolve));

  const messageQueue = [];

  const processQueue = async () => {
    if (messageQueue.length === 0)
      return;
  
    const incomingMessage = messageQueue[0];
    const request = JSON.parse(incomingMessage.body.toString('utf-8'));
    console.log(request);
    const response = await requestHandler(request);
    console.log(response);
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

  socket.on('data', onSocketData);

  const close = () => {
    socket.off('data', onSocketData);
  };

  return {
    messageQueue,
    close,
  };
};

module.exports = {
  RPCResponseError,
  createRPCMethod,
  createRPCRouter,
  createSocketRPCHandler,
};