const fs = require('fs');
const env = process.env['uenv'];

const ENV = {
  api: {
    dev: 'http://localhost:3000',
    prod: 'http://localhost:3000',
  },

  static: {
    dev: 'http://localhost:8081',
    prod: 'http://localhost:5000',
  }
};

let config = `export const ENV = { api: '${ENV.api[env]}', static: '${ENV.static[env]}' };`;

fs.writeFile("./src/constants.js", config, 'utf8', function (err) {
  if (err) {
    return console.log(err);
  }

  console.log(`
---- API server is ${ENV.api[env]}, static server is ${ENV.static[env]}
  `);
});
