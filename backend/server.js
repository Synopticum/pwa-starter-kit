const db  = require('./db');
const Fastify = require('fastify');
const fetch = require('node-fetch');
const routes = require('./routes');

function build (opts) {
    const fastify = Fastify(opts);

    fastify
        .use(require('cors')())
        .register(require('fastify-auth'))
        .after(getRoutes);

    fastify.decorate('verifyVkAuth', verifyVkAuth);

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

    function getRoutes() {
        // api
        fastify.route({
            method: 'GET',
            url: '/api/objects/coordinates/paths',
            beforeHandler: fastify.auth([fastify.verifyVkAuth]),
            handler: routes.getPaths
        });

        fastify.route({
            method: 'GET',
            url: '/api/objects/coordinates/circles',
            beforeHandler: fastify.auth([fastify.verifyVkAuth]),
            handler: routes.getCircles
        });

        fastify.route({
            method: 'GET',
            url: '/api/objects',
            beforeHandler: fastify.auth([fastify.verifyVkAuth]),
            handler: routes.getObjectsByCoordinates
        });
    }

    return fastify;
}

if (require.main === module) {
    const fastify = build({
        // logger: {
        //     level: 'info'
        // }
    });

    fastify.listen(3000, err => {
        if (err) throw err;
        console.log(`Server listenting at http://localhost:${fastify.server.address().port}`)
    })
}

module.exports = build;