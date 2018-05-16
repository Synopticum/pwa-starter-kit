const ObjectModel = require('../../db/object.model');

async function getPathsCoordinates() {
    const paths = await ObjectModel.find({ type: 'path' });
    return paths;
}

async function getCirclesCoordinates() {
    const circles = await ObjectModel.find({ type: 'circle' }).select({ '_id': 0, 'type': 0});
    return circles;
}

async function getObjectsByCoordinates(coordinates) {
    const objects = await ObjectModel.findOne({ coordinates });
    return objects;
}

module.exports = {
    getPathsCoordinates,
    getCirclesCoordinates,
    getObjectsByCoordinates
};