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