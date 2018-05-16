const ObjectModel = require('../../db/object.model');

async function getObjectsByCoordinates(coordinates) {
    const objects = await ObjectModel.findOne({ coordinates });
    return objects;
}

module.exports = getObjectsByCoordinates;