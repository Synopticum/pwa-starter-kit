export default {
    dotId: {
        type: String
    },

    areCommentsVisible: {
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

    _dot: {
        type: Object,
        attribute: false
    },

    _activeImage: {
        type: String,
        attribute: false
    },

    _activeDecade: {
        type: String,
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