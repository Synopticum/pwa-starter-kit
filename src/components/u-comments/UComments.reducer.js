//
// Reducer
//
import {CommentsConstants} from "./UComments.actions";
import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName
} from "../../middleware/asyncActionsMiddleware";

export const comments = (state = {
    objectPage: {
        items: [],
        isFetching: false,
        isCommentAdding: false,
        itemsToDelete: [],
        currentMessage: ''
    },
    dotPage: {
        items: [],
        isFetching: false,
        isCommentAdding: false,
        itemsToDelete: [],
        currentMessage: ''
    }, }, action) => {
    const fieldName = getFieldName(action.type);
    switch (action.type) {
        // Dot page - GET
        case generateInProgressActionTypeName(CommentsConstants.DOT_PAGE.FETCH):
        case generateInProgressActionTypeName(CommentsConstants.OBJECT_PAGE.FETCH):
            return {
                ...state,
                [fieldName]: {
                    ...state[fieldName],
                    isFetching: true
                }
            };

        case generateSuccessActionTypeName(CommentsConstants.DOT_PAGE.FETCH):
        case generateSuccessActionTypeName(CommentsConstants.OBJECT_PAGE.FETCH):
            return {
                ...state,
                [fieldName]: {
                    ...state[fieldName],
                    items: action.payload,
                    isFetching: false
                }
            };

        case generateErrorActionTypeName(CommentsConstants.DOT_PAGE.FETCH):
        case generateErrorActionTypeName(CommentsConstants.OBJECT_PAGE.FETCH):
            return {
                ...state,
                [fieldName]: {
                    ...state[fieldName],
                    isFetching: false
                }
            };

        // Dot page - PUT
        case generateInProgressActionTypeName(CommentsConstants.DOT_PAGE.PUT):
        case generateInProgressActionTypeName(CommentsConstants.OBJECT_PAGE.PUT):
            return {
                ...state,
                [fieldName]: {
                    ...state[fieldName],
                    isCommentAdding: true
                }
            };

        case generateSuccessActionTypeName(CommentsConstants.DOT_PAGE.PUT):
        case generateSuccessActionTypeName(CommentsConstants.OBJECT_PAGE.PUT):
            return {
                ...state,
                [fieldName]: {
                    ...state[fieldName],
                    items: [...state[fieldName].items, action.payload],
                    isCommentAdding: false,
                    currentMessage: ''
                }
            };

        case generateErrorActionTypeName(CommentsConstants.DOT_PAGE.PUT):
        case generateErrorActionTypeName(CommentsConstants.OBJECT_PAGE.PUT):
            return {
                ...state,
                [fieldName]: {
                    ...state[fieldName],
                    isCommentAdding: false
                }
            };

        // Dot page - DELETE
        case CommentsConstants.DOT_PAGE.DELETE:
        case CommentsConstants.OBJECT_PAGE.DELETE:
            const [originType, originId, commentId] = action.params;

            return {
                ...state,
                [fieldName]: {
                    ...state[fieldName],
                    itemsToDelete: [...state[fieldName].itemsToDelete, commentId]
                }
            };

        case generateInProgressActionTypeName(CommentsConstants.DOT_PAGE.DELETE):
        case generateInProgressActionTypeName(CommentsConstants.OBJECT_PAGE.DELETE):
            return state;

        case generateSuccessActionTypeName(CommentsConstants.DOT_PAGE.DELETE):
        case generateSuccessActionTypeName(CommentsConstants.OBJECT_PAGE.DELETE):
            return {
                ...state,
                [fieldName]: {
                    ...state[fieldName],
                    items: state[fieldName].items.filter(comment => comment.id !== action.payload),
                    itemsToDelete: state[fieldName].itemsToDelete.filter(commentId => commentId !== commentId)
                }
            };

        case generateErrorActionTypeName(CommentsConstants.DOT_PAGE.DELETE):
        case generateErrorActionTypeName(CommentsConstants.OBJECT_PAGE.DELETE):
            return {
                ...state,
                [fieldName]: {
                    ...state[fieldName],
                    itemsToDelete: state[fieldName].itemsToDelete.filter(commentId => commentId !== commentId)
                }
            };

        default:
            return state;
    }
};

function getFieldName(actionType) {
    if (actionType.includes('_DOT_')) return 'dotPage';
    if (actionType.includes('_OBJECT_')) return 'objectPage';
}