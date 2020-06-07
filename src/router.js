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
};

// initialization router
const createAsyncInitializationRouter = (createInitializedRouter) => {
  let initializedRouter = null;
  let receivedInitializationRequest = false;

  const handleRequest = async (request) => {
    if (initializedRouter)
      return initializedRouter.handleRequest(request);
    if (request.method !== 'initialize')
      return { id: request.id, error: new RPCResponseError(-32001, `Another request was sent before the server was initialized`) };
    if (receivedInitializationRequest)
      return { id: request.id, error: new RPCResponseError(-32001, `A second initialize request was received; you should only send one.`) };
    
    receivedInitializationRequest = true;
    const { router, capabilities, serverInfo } = await createInitializedRouter(request.params);
    console.log('The server is initialized');
    initializedRouter = router;
    return { id: request.id, result: { capabilities, serverInfo, } };
  };

  return {
    handleRequest,
  };
};

// basic router
const createRPCMethod = (methodName, methodHandler) => {
  return {
    methodName,
    methodHandler,
  };
};

const createRPCNotification = (notificationName, notificationHandler) => {
  return {
    notificationName,
    notificationHandler,
  };
};

const createBasicRPCRouter = (rpcMethods, rpcNotifications, defaultResponseHandler) => {
  const methodNameMap = new Map(rpcMethods.map(method => [method.methodName, method.methodHandler]));
  const notificationNameMap = new Map(rpcNotifications.map(notification => [notification.notificationName, notification.notificationHandler]));

  const handleRequest = async (request) => {
    try {
      // check for methods with the same request method
      if (methodNameMap.has(request.method)) {
        const handler = methodNameMap.get(request.method);
        const result = await handler(request.params);
        return { id: request.id, result };
      }
      // check for notifications with the same request name
      else if (notificationNameMap.has(request.method)) {
        const handler = notificationNameMap.get(request.method);
        // notifications only perform side effects
        await handler(request.params);
        return null;
      }
      // no matches, give the default response handle
      else {
        if (!request.id) {
          // it's a notification we don't understand, log it, do nothing, and pray nothing breaks.
          console.error(`Unknown notification: ${request}`);
          return null;
        }
        const result = await defaultResponseHandler(request.id, request.params);
        return { id: request.id, result };
      }
    } catch (error) {
      console.error(error);
      if (error instanceof RPCResponseError)
        return { id: request.id, error };
      return { id: request.id, error: new RPCResponseError() };
    }
  };

  return {
    handleRequest,
  };
};

module.exports = {
  RPCResponseError,
  createAsyncInitializationRouter,
  createRPCMethod,
  createRPCNotification,
  createBasicRPCRouter,
};