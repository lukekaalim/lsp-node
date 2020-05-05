const { assert } = require('@lukekaalim/test');
const { createProtocolReader } = require('./protocol');

const { testHeaderReader } = require('./protocol/headerReader.test');
const { testBodyReader } = require('./protocol/bodyReader.test');

// 156 bytes
const sessionNotes = [
  'DM: You are walking through the woods.',
  'DM: You hear the shrieking noise of a banshee!',
  'Vari: I sneak up on it, and attack it!',
  'DM: Roll to hit, it\'s AC is 14.',
].join('\n');
const greetingMessage = `content-length: 19\r\n\r\nWelcome to my Code!`;
const sessionNotesMessage = `content-length: 156\r\n\r\n${sessionNotes}`;
const farewellMessage = `content-length: 32\r\n\r\nI hope you had a great time 😉`;

const testSimpleMessageReading = (protocolReader) => {
  const simpleMessage = Buffer.from(`${greetingMessage}`);

  const messages = protocolReader.read(simpleMessage);

  return assert(`The reader can consume a continuous, unbroken message`, [
    assert('The reader only returns one message', messages.length === 1),
    assert('The reader only returns the specified text within the content length', messages[0] === 'Welcome to my Code!'),
  ]);
};

const testProtocolReader = () => {
  return assert('protocol.js exports a constructor that emits language server protocol messages when fed data', [
    testSimpleMessageReading(createProtocolReader()),
    testHeaderReader(),
    testBodyReader(),
  ]);
};

module.exports = {
  testProtocolReader,
};
