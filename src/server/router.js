const { promises: { writeFile } } = require('fs');
const { createProtocolReader } = require('../protocol');

const createRouter = (routes) => {
  const connections = [];

  const onConnection = (socket) => {
    const reader = createProtocolReader();

    socket.on('connect', () => {
      console.log('connected!');
    });

    socket.on('close', () => {
      // clean up
      console.log('closed!');
    });

    socket.on('data', async (data) => {
      console.log(data);
      await writeFile(`./data-${Math.floor(Math.random() * 1000)}.log`, data, 'utf-8');
      const messages = reader.readChunk(data);
      for (const message of messages) {
        console.log(JSON.parse(message.body.toString('utf-8')));
      }
    });

    socket.on('end', () => {
      // do something with data
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
