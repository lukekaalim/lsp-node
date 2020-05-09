const { exec } = require('child_process');

const start = async () => {
  exec(`code --extensionDevelopmentPath=${__dirname}`);
};

start();