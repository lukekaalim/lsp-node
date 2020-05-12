const { promises: { writeFile } } = require('fs');
const { createProtocolReader } = require('../protocol');

const createRouter = (routes) => {
  const connections = [];

  const handleRequest = (request) => {

  };

  const onConnection = (socket) => {
    const reader = createProtocolReader();

    socket.on('data', async (data) => {
      const protocolMessages = reader.readChunk(data);
    });

    socket.on('connect', () => {
      console.log('connected!');
    });

    socket.on('close', () => {
      console.log('closed!');
    });

    socket.on('end', () => {
      console.log('end!');
    });

    socket.on('error', () => {
      console.log('error!', error);
    });
  };

  return {
    onConnection,
  };
};

module.exports = {
  createRouter,
};
