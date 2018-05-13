const db  = require('./db');
const fastify = require('fastify')();
const path = require('path');
const routes = require('./routes');

fastify.use(require('cors')());

fastify.register(require('fastify-static'), {
    root: path.join(__dirname, '../'),
    prefix: '/public/', // optional: default '/'
});

fastify.get('/login', routes.static.getLoginPage);
fastify.get('/static/normalize.css', routes.static.getNormalizeCss);

fastify.get('/api/objects/coordinates/paths', routes.dynamic.getPaths);
fastify.get('/api/objects/coordinates/circles', routes.dynamic.getCircles);
fastify.get('/api/objects', routes.dynamic.getObjectsByCoordinates);

fastify.listen(3000, '127.0.0.1', function (err) {
    if (err) throw err;
    console.log(`server listening on ${fastify.server.address().port}`)
});