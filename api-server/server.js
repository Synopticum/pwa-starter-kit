const db  = require('./db');
const fastify = require('fastify')();
const ObjectModel = require('./db/object.model');

fastify.get('/api/objects/coordinates/paths', async (request, reply) => {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.type('application/json').code(200);
    const paths = await ObjectModel.find({ type: 'path' });
    return paths;
});

fastify.get('/api/objects/coordinates/circles', async (request, reply) => {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.type('application/json').code(200);
    const circles = await ObjectModel.find({ type: 'circle' }).select({ '_id': 0, 'type': 0});
    return circles;
});

fastify.listen(3000, '127.0.0.1', function (err) {
    if (err) throw err;
    console.log(`server listening on ${fastify.server.address().port}`)
});