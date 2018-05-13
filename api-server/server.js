const db  = require('./db');
const fastify = require('fastify')();
const path = require('path');
const routes = require('./routes');
const serveStatic = require('serve-static');

fastify.use(require('cors')());

fastify.use('*', serveStatic(path.join(__dirname, '../build/es6-bundled')));
fastify.use('/service-worker.js', serveStatic(path.join(__dirname, '../service-worker.js'), {'index': ['service-worker.js']}));
fastify.use('/node_modules/leaflet', serveStatic(path.join(__dirname, '../node_modules/leaflet')));
fastify.use('/node_modules/normalize.css', serveStatic(path.join(__dirname, '../node_modules/normalize.css')));
fastify.use('/node_modules/@webcomponents/webcomponentsjs', serveStatic(path.join(__dirname, '../node_modules/@webcomponents/webcomponentsjs')));

fastify.get('/api/objects/coordinates/paths', routes.dynamic.getPaths);
fastify.get('/api/objects/coordinates/circles', routes.dynamic.getCircles);
fastify.get('/api/objects', routes.dynamic.getObjectsByCoordinates);

fastify.listen(3000, '127.0.0.1', function (err) {
    if (err) throw err;
    console.log(`server listening on ${fastify.server.address().port}`)
});