const ObjectModel = require('../../db/object.model');

async function getCirclesCoordinates() {
    const circles = await ObjectModel.find({ type: 'circle' }).select({ '_id': 0, 'type': 0});
    return circles;
}

module.exports = getCirclesCoordinates;