const controllers = require('./controllers');

async function getPaths(request, reply) {
    reply.type('application/json').code(200);
    const paths = await controllers.getPathsCoordinates();
    return paths;
}

async function getCircles(request, reply) {
    reply.type('application/json').code(200);
    const circles = await controllers.getCirclesCoordinates();
    return circles;
}

module.exports = {
    getPaths,
    getCircles
};