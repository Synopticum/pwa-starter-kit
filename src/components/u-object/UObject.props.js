import entityProps from '../u-entity/UEntity.props';

export default {
    ...entityProps,

    objectId: {
        type: String
    },

    _object: {
        type: Object,
        attribute: false
    },
};