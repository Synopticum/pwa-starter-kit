const ObjectModel = require('../../db/object.model');

async function getPathsCoordinates() {
    const paths = await ObjectModel.find({ type: 'path' });
    return paths;
}

module.exports = getPathsCoordinates;