const { assert } = require('@lukekaalim/test');
const { createLines, updateLines } = require('./utils/lines');

const testCreateDocument = () => {
  return assert('Test create document', [
    testCreateLines(),
    testUpdateLines(),
  ]);
};

const testCreateLines = () => {
  const document = createLines(`one\ntwo\nthree\r\nfour\rfive\r\nsix\rseven\n\rnine`);
  return assert('nine lines', document.length === 9);
};

const testUpdateLines = () => {
  const document = createLines('hello world\ngoodbye world');
  const range = { start: { line: 0, character: 6 }, end: { line: 0, character: 10 } };
  const updatedDocument = updateLines(document, range, 'there');
  return assert(updatedDocument, updatedDocument[0] === 'hello there');
};

module.exports = {
  testCreateDocument,
};
