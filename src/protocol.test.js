const { assert } = require('@lukekaalim/test');
const { parseLSPMessage, createLSPMessage } = require('./protocol');

const testMessageSelfConsumption = () => {
  return assert('createLSPMessage() should return a valid LSP message that parseLSPMessage() should parse',
    parseLSPMessage(createLSPMessage('Hello There')) === 'Hello There'
  );
};

const testMessageParsing = () => {
  const testMessage = [
    ' Content-Length: 11  ',
    '',
    'Cool Times!'
  ].join('\n');

  return assert('parseLSPMessage() should parse a simple cool message',
    parseLSPMessage(testMessage) === 'Cool Times!'
  );
};

const lspMessageExpression = new RegExp(/^(?<firstHeader>.+:.+)\n(?:(?<secondHeader>.+:.+)\n)*\n(?<body>[^]*)$/);

const testMessageConstruction = () => {
  const testMessage = createLSPMessage('Hello There!!!');

  const {
    groups: {
      firstHeader = null,
      secondHeader = null,
      body = '' 
    } = {}
  } = lspMessageExpression.exec(testMessage) || {};

  return assert('parseLSPMessage() should create a simple greeting message: \'Hello There!!!\'', [
    assert('firstHeader declares a content length of 14', firstHeader === 'Content-Length:14'),
    assert('secondHeader declares the content type of utf-8', secondHeader === 'Content-Type:utf-8'),
    assert('body contains the input text: \'Hello There!!!\'', body === 'Hello There!!!'),
  ]);
};

const testLSPProtocol = () => {
  return assert('The LSP Protocol module can create and parse Language Server messages', [
    testMessageSelfConsumption(),
    testMessageParsing(),
    testMessageConstruction(),
  ]);
};

module.exports = {
  testLSPProtocol,
};