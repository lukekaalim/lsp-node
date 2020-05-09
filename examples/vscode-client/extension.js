const net = require('net');
const path = require('path');

const { workspace, window } = require("vscode");
const { LanguageClient } = require('vscode-languageclient');

let client;

function activate(context) {
  let orange = window.createOutputChannel("Orange");

  //Write to output.
  orange.appendLine("I am a banana.");

	// The server is implemented in node
	let serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);
	// The debug options for the server
	// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
	let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	let serverOptions = async () => {
		console.log('CONNECTING TO 6543');
		const socket = net.createConnection(6543, 'localhost', () => {
			console.log('connected');
		});
	
		return {
			writer: socket,
			reader: socket,
			detached: false,
		};
	};

	// Options to control the language client
	let clientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'plaintext' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'languageServerExample',
		'Language Server Example',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();
}

function deactivate() {
	if (!client) {
		return undefined;
	}
	return client.stop();
}

module.exports = {
  activate,
  deactivate,
};
