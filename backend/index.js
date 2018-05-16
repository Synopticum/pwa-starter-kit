'use strict'

const db  = require('./db');
const fetch = require('node-fetch');

module.exports = async function (fastify, opts) {
    // fastify
    //     .register(require('fastify-static'), {
    //         root: path.join(__dirname, '../frontend', 'build'),
    //         prefix: '/'
    //     })

  fastify
    .use(require('cors')())
    .register(require('fastify-auth'))
    .decorate('verifyVkAuth', require('./services/login/verifyVkAuth'))
    .register(require('./services/objects'), { prefix: '/api' })
    .register(require('./services/objects/paths'), { prefix: '/api' })
    .register(require('./services/objects/circles'), { prefix: '/api' });

  async function verifyVkAuth(request, reply, done) {
    let accessToken = request.headers['vk-access-token'];

    if (accessToken) {
      let response = await fetch(`https://api.vk.com/method/users.get?access_token=${accessToken}&v=5.74`);
      let json = await response.json();

      if (!json.error) {
        done();
      } else {
        done(new Error('Unauthorized'));
      }
    }
  }
}
