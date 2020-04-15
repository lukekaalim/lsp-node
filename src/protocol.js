// https://microsoft.github.io/language-server-protocol/specifications/specification-current/#headerPart
// LSP only supports two types of headers, contentType and contentLength
const createLSPHeaders = (contentType, contentLength) => {
  const contentLengthHeader = { property: 'Content-Length', value: contentLength };
  const contentTypeHeader = { property: 'Content-Type', value: contentType };
  const headers = [
    contentLengthHeader,
    contentTypeHeader,
  ];
  return headers
    .map(header => `${header.property}:${header.value}\n`)
    .join('');
};

// https://microsoft.github.io/language-server-protocol/specifications/specification-current/#contentPart
const createLSPBody = body => {
  return body
};

// https://microsoft.github.io/language-server-protocol/specifications/specification-current/#baseProtocol
const createLSPMessage = (body) => {
  const lspBody = createLSPBody(body);
  const lspHeader = createLSPHeaders('utf-8', Buffer.from(lspBody, 'utf-8').length);

  return [
    lspHeader,
    lspBody,
  ].join('\n')
};

const EOLCharacters = ['\n', '\r\n', '\r'];

const parseLSPHeaderValue = (message, initalIndex) => {
  let index = initalIndex;
  while (index < message.length) {
    const char = message.charAt(index);
    if (EOLCharacters.includes(char)) {
      const headerName = message.slice(initalIndex, index).trim();
      return [headerName, index + 1];
    }
    index++;
  }
  throw new Error('Unexpected End of String when parsing Header Value');
};

const parseLSPHeaderName = (message, initalIndex) => {
  let index = initalIndex;
  while (index < message.length) {
    const char = message.charAt(index);
    if (EOLCharacters.includes(char)) {
      throw new Error('Unexpected EOL when parsing Header Name');
    }
    if (char === ':') {
      const headerName = message.slice(initalIndex, index).trim();
      return [headerName, index + 1];
    }
    index++;
  }
  throw new Error('Unexpected End of String when parsing Header Name');
};

const parseLSPHeader = (message, initalIndex) => {
  const [name, headerNameIndex] = parseLSPHeaderName(message, initalIndex);
  const [value, headerValueIndex] = parseLSPHeaderValue(message, headerNameIndex);

  return [[name, value], headerValueIndex];
};

const parseLSPHeaders = (message, initalIndex) => {
  let index = initalIndex;
  const headers = [];
  while (index < message.length) {
    const char = message.charAt(index);
    if (EOLCharacters.includes(char)) {
      return [Object.fromEntries(headers), index + 1];
    }
    const [header, headerIndex] = parseLSPHeader(message, index);
    headers.push(header);
    index = headerIndex;
  }
  throw new Error('Unexpected End of String when parsing headers');
};

const parseLSPBody = (message, contentLength, contentType, initalIndex) => {
  return Buffer.from(message.slice(initalIndex)).toString(contentType || 'utf-8', 0, contentLength);
};

const parseLSPMessage = (message) => {
  const [headers, headersIndex] = parseLSPHeaders(message, 0);
  const body = parseLSPBody(message, headers['Content-Length'], headers['Content-Type'], headersIndex);
  return body;
};

module.exports = {
  createLSPMessage,
  parseLSPMessage,
};
