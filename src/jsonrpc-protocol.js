const { createId } = require('./id');

// https://microsoft.github.io/language-server-protocol/specifications/specification-current/#requestMessage
const createJSONRPCRequest = (method, params) => ({
  id: createId(),
  method,
  params,
});

// https://microsoft.github.io/language-server-protocol/specifications/specification-current/#responseMessage
const createResponseError = (code, message, data) => ({
  code,
  message,
  data,
});

const createJSONRPCSuccessResponse = (requestId, result) => ({
  id: requestId,
  result,
});

const createJSONRPCErrorResponse = (requestId, error) => ({
  id: requestId,
  error,
});

// https://microsoft.github.io/language-server-protocol/specifications/specification-current/#notificationMessage
const createJSONRPCNotification = (method, params) => ({
  ...createJSONRPCMessage(),
  method,
  params,
});

// https://microsoft.github.io/language-server-protocol/specifications/specification-current/#abstract-message
const createJSONRPCMessage = () => ({
  jsonrpc: '2.0'
});

module.exports = {
  createJSONRPCRequest,
  createResponseError,
  createJSONRPCSuccessResponse,
  createJSONRPCErrorResponse,
};