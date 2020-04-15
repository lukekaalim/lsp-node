const { promises: { writeFile } } = require('fs');
const { parseLSPMessage } = require('../protocol');

const createRouter = (routes) => {
  const connections = [];

  const onConnection = (socket) => {
    socket.setEncoding('utf8');

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
      const content = parseLSPMessage(data);
      console.log(content);
    });

    socket.on('end', () => {
      // do something with data
      console.log('end!', fragments);
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
