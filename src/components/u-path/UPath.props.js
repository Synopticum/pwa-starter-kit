import entityProps from '../u-entity/UEntity.props';

export default {
    ...entityProps,

    pathId: {
        type: String
    },

    _path: {
        type: Object,
        attribute: false
    },
};