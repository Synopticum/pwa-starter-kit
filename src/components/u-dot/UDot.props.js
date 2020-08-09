import entityProps from '../u-entity/UEntity.props';

export default {
    ...entityProps,

    dotId: {
        type: String
    },

    _dot: {
        type: Object,
        attribute: false
    },
};