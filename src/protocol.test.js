const { assert } = require('@lukekaalim/test');


const testContinuousMessage = async (protocolReader) => {
  const continuousMessage = `content-length: 17\r\n\r\n{"hello":"there"} invalid json`;

  protocolReader.read(continuousMessage);
};

const testProtocolReader = (protocolReader) => {

  
};