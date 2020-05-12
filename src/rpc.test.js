const { assert } = require('@lukekaalim/test');

const { createSocketRPCHandler } = require('./rpc');

const createMockSocket = () => {
  const dataHandlers = [];
  const dataWritten = [];
  const on = (eventName, eventHandler) => {
    if (eventName === 'data')
      dataHandlers.push(eventHandler);
  };
  const write = (data, callback) => {
    dataWritten.push(data.toString('utf-8'));
    return callback();
  };

  const writeToSocket = async (data) => {
    const chunk = Buffer.from(data);
    for (const handler of dataHandlers)
      await handler(chunk);
  };
  const readFromSocket = () => {
    return dataWritten.join('');
  };

  return {
    socket: { on, write },
    writeToSocket,
    readFromSocket,
  };
}

const testSocketHandler = async () => {
  const { socket, writeToSocket, readFromSocket } = createMockSocket();
  const mockRequestHandler = async (request) => {
    if (request.method === 'info')
      return { data: 'im cool' };
    return null;
  };
  const socketHandler = createSocketRPCHandler(socket, mockRequestHandler);
  await writeToSocket(`content-length: 20\r\n\r\n{ "method": "info" }`);
  const writtenData = readFromSocket();

  return assert(
    'SocketRPCHandler invokes a handler for a Language Server request, and sends a response over a socket',
    writtenData.includes(`im cool`)
  );
};

module.exports = {
  testSocketHandler,
};