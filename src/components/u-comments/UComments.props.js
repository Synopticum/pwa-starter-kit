export default {
    originType: {
        type: String,
        attribute: 'origin-type'
    },

    originId: {
        type: String,
        attribute: 'origin-id'
    },

    _isFetching: {
        type: Boolean,
        attribute: false
    },

    _isCommentAdding: {
        type: Boolean,
        attribute: false
    },

    _isValid: {
        type: Boolean,
        attribute: false
    },

    _comments: {
        type: Array,
        attribute: false
    },

    _commentsToDelete: {
        type: Array,
        attribute: false
    }
};