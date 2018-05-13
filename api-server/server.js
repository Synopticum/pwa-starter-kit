const db  = require('./db');
const fastify = require('fastify')();
const routes = require('./routes');

fastify.use(require('cors')());

fastify.get('/api/objects/coordinates/paths', routes.getPaths);
fastify.get('/api/objects/coordinates/circles', routes.getCircles);
fastify.get('/api/objects', routes.getObjectsByCoordinates);

fastify.listen(3000, '127.0.0.1', function (err) {
    if (err) throw err;
    console.log(`server listening on ${fastify.server.address().port}`)
});