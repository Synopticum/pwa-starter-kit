export default {
    pathId: {
        type: String
    },

    areCommentsVisible: {
        type: Boolean,
        attribute: false
    },

    areControlsVisible: {
        type: Boolean,
        attribute: false
    },

    isSpinnerVisible: {
        type: Boolean,
        attribute: false
    },

    _comments: {
        type: Array,
        attribute: false
    },

    _user: {
        type: Object,
        attribute: false
    },

    _path: {
        type: Object,
        attribute: false
    },

    _isFetching: {
        type: Boolean,
        attribute: false
    },

    _isUpdating: {
        type: Boolean,
        attribute: false
    },

    _isLoadingError: {
        type: Boolean,
        attribute: false
    }
};