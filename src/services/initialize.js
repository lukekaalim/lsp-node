const { createRPCNotification } = require('../router');

const createInitializeService = () => {
  let isInitialized = false;

  const initializedNotification = createRPCNotification('initialized', async () => {
    console.log('The client is initialized');
    isInitialized = true;
  });

  const getNotifications = () => {
    return [
      initializedNotification,
    ];
  };

  const getInitialized = () => {
    return isInitialized;
  };

  return {
    getNotifications,
    getInitialized,
  };
};

module.exports = {
  createInitializeService,
};