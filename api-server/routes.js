const controllers = require('./controllers');
const serveStatic = require('serve-static');
const path = require('path');

function getApp() {
    return serveStatic(path.join(__dirname, '../build/es6-bundled'));
}

function getSW() {
    return serveStatic(path.join(__dirname, '../service-worker.js'), {'index': ['service-worker.js']});
}

function getLeaflet() {
    return serveStatic(path.join(__dirname, '../node_modules/leaflet'));
}

function getNormalizeCss() {
    return serveStatic(path.join(__dirname, '../node_modules/normalize.css'));
}

function getWebComponents() {
    return serveStatic(path.join(__dirname, '../node_modules/@webcomponents/webcomponentsjs'));
}

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

async function getObjectsByCoordinates(request, reply) {
    if (request.query && request.query.coordinates) {
        reply.type('application/json').code(200);
        const coordinates = JSON.parse(request.query.coordinates);
        const objects = await controllers.getObjectsByCoordinates(coordinates);
        return objects;
    }
}

module.exports = {
    getApp,
    getSW,
    getLeaflet,
    getNormalizeCss,
    getWebComponents,

    getPaths,
    getCircles,
    getObjectsByCoordinates
};