const fs = require('fs');
const env = process.env['uenv'];

fs.writeFileSync('./environments/current.js', `window.ENV = '${env}';`, 'utf8');