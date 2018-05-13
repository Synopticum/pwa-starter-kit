const fastify = require('fastify')();

fastify.get('/api/objects/coordinates/paths', async (request, reply) => {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.type('application/json').code(200);
    return [
        { coordinates: [[68.22,7.21],[69.33,13.62],[68.38,14.99],[67.20,8.39]] }
    ]
});

fastify.listen(3000, '127.0.0.1', function (err) {
    if (err) throw err;
    console.log(`server listening on ${fastify.server.address().port}`)
});