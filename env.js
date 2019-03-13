const fs = require('fs');
const env = process.env['uenv'];

const ENV = {
  dev: {
    static: 'http://localhost:8081',
    api: 'http://localhost:3000'
  },

  // prod: {
  //   static: 'https://www.u-r-u-s-s-u.com',
  //   api: 'https://www.u-r-u-s-s-u.com:12345'
  // },

  prod: {
    static: 'http://localhost:5000',
    api: 'http://localhost:3000'
  }
};

let config = `export const ENV = { api: '${ENV[env].api}', static: '${ENV[env].static}' };`;

let files = ["./constants.js", "./src/constants.js"];
files.forEach(file => {
  fs.writeFileSync(file, config, 'utf8');
});
