const services = require('./services');

async function getPaths(request, reply) {
    reply.type('application/json').code(200);
    const paths = await services.objects.getPathsCoordinates();
    return paths;
}

async function getCircles(request, reply) {
    reply.type('application/json').code(200);
    const circles = await services.objects.getCirclesCoordinates();
    return circles;
}

async function getObjectsByCoordinates(request, reply) {
    if (request.query && request.query.coordinates) {
        reply.type('application/json').code(200);
        const coordinates = JSON.parse(request.query.coordinates);
        const objects = await services.objects.getObjectsByCoordinates(coordinates);
        return objects;
    }
}

module.exports = {
    getPaths,
    getCircles,
    getObjectsByCoordinates
};