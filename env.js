const fs = require('fs');
const env = process.env['uenv'];

const ENV = {
  api: {
    dev: 'http://localhost:3000',
    prod: 'https://localhost:3000',
  },

  static: {
    dev: 'http://localhost:8081',
    prod: 'https://localhost',
  }
};

let config = `export const ENV = { api: '${ENV.api[env]}', static: '${ENV.static[env]}' };`;
let files = ["./constants.js", "./src/constants.js"];

files.forEach(file => {
  fs.writeFileSync(file, config, 'utf8');
});
