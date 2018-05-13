const fastify = require('fastify')();
const path = require('path');

fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'mock'),
    prefix: '/api-server/',
});

fastify.get('/api/objects/coordinates/paths', async (request, reply) => {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.type('application/json').code(200);
    reply.sendFile('paths.json');
});

fastify.get('/api/objects/coordinates/circles', async (request, reply) => {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.type('application/json').code(200);
    reply.sendFile('circles.json');
});

fastify.listen(3000, '127.0.0.1', function (err) {
    if (err) throw err;
    console.log(`server listening on ${fastify.server.address().port}`)
});