//https://microsoft.github.io/language-server-protocol/specifications/specification-current/#initialize
const initalizeMessage = (processId, clientName, clientVersion, rootPath) => ({
  processId,
  
	clientInfo: {
		name: clientName,
		version: clientVersion,
  },
  
  rootPath,
});

module.exports = {
  initalizeMessage,
};
