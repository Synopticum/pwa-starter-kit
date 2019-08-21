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
    switch (action.type) {
        // Dot page - GET
        case generateInProgressActionTypeName(CommentsConstants.DOT_PAGE.FETCH):
            return {
                ...state,
                dotPage: {
                    ...state.dotPage,
                    isFetching: true
                }
            };

        case generateSuccessActionTypeName(CommentsConstants.DOT_PAGE.FETCH):
            return {
                ...state,
                dotPage: {
                    ...state.dotPage,
                    items: action.payload,
                    isFetching: false
                }
            };

        case generateErrorActionTypeName(CommentsConstants.DOT_PAGE.FETCH):
            return {
                ...state,
                dotPage: {
                    ...state.dotPage,
                    isFetching: false
                }
            };

        // Dot page - PUT
        case generateInProgressActionTypeName(CommentsConstants.DOT_PAGE.PUT):
            return {
                ...state,
                dotPage: {
                    ...state.dotPage,
                    isCommentAdding: true
                }
            };

        case generateSuccessActionTypeName(CommentsConstants.DOT_PAGE.PUT):
            return {
                ...state,
                dotPage: {
                    ...state.dotPage,
                    items: [...state.dotPage.items, action.payload],
                    isCommentAdding: false,
                    currentMessage: ''
                }
            };

        case generateErrorActionTypeName(CommentsConstants.DOT_PAGE.PUT):
            return {
                ...state,
                dotPage: {
                    ...state.dotPage,
                    isCommentAdding: false
                }
            };

        // Dot page - DELETE
        case CommentsConstants.DOT_PAGE.DELETE:
            const [originType, originId, commentId] = action.params;

            return {
                ...state,
                dotPage: {
                    ...state.dotPage,
                    itemsToDelete: [...state.dotPage.itemsToDelete, commentId]
                }
            };

        case generateInProgressActionTypeName(CommentsConstants.DOT_PAGE.DELETE):
            return state;

        case generateSuccessActionTypeName(CommentsConstants.DOT_PAGE.DELETE):
            return {
                ...state,
                dotPage: {
                    ...state.dotPage,
                    items: state.dotPage.items.filter(comment => comment.id !== action.payload),
                    itemsToDelete: state.dotPage.itemsToDelete.filter(commentId => commentId !== commentId)
                }
            };

        case generateErrorActionTypeName(CommentsConstants.DOT_PAGE.DELETE):

            return {
                ...state,
                dotPage: {
                    ...state.dotPage,
                    itemsToDelete: state.dotPage.itemsToDelete.filter(commentId => commentId !== commentId)
                }
            };

        default:
            return state;
    }
};