const db  = require('./db');
const Fastify = require('fastify');
const routes = require('./routes');

function build (opts) {
    const fastify = Fastify(opts);

    fastify
        .use(require('cors')())
        .register(require('fastify-auth'))
        .after(getRoutes);

    fastify.decorate('verifyVkAuth', verifyVkAuth);

    function verifyVkAuth (request, reply, done) {
        // https://api.vk.com/method/users.get?access_token=55096e8e471c8a2f85638d937c85d256a665157370266e44858bce489f510ee111e49bbbf49e6294851b2&v=5.74
        done();
    }

    function getRoutes() {
        // static
        fastify.use('*', routes.getApp);
        fastify.use('/service-worker.js', routes.getSW);
        fastify.use('/node_modules/leaflet', routes.getLeaflet);
        fastify.use('/node_modules/normalize.css', routes.getNormalizeCss);
        fastify.use('/node_modules/@webcomponents/webcomponentsjs', routes.getWebComponents);

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