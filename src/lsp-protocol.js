// https://microsoft.github.io/language-server-protocol/specifications/specification-current/#headerPart
const createLSPHeaders = (contentType, contentLength) => {
  const contentLengthHeader = { property: 'Content-Length', value: contentLength };
  const contentTypeHeader = { property: 'Content-Type', value: contentType };
  const headers = [
    contentLengthHeader,
    contentTypeHeader,
  ];
  return headers
    .map(header => [header.property, ':', header.value, '\r\n'].join(''))
    .join('');
};

// https://microsoft.github.io/language-server-protocol/specifications/specification-current/#contentPart
const createLSPBody = (body) => {
  return JSON.stringify(body);
};

// https://microsoft.github.io/language-server-protocol/specifications/specification-current/#baseProtocol
const createLSPMessage = (body) => {
  return [
    createLSPHeaders('utf8', Buffer.from(body, 'utf8')),
    createLSPBody(body),
  ].join('\r\n')
};

module.exports = {
  createLSPMessage,
};
