//
// Reducer
//
import {CommentsConstants} from "../components/u-comments/UComments.actions";
import {
    generateInProgressActionTypeName,
    generateSuccessActionTypeName,
    generateErrorActionTypeName
} from "../middleware/asyncActionsMiddleware";

export const comments = (state = {
    objectPage: {
        items: [],
        isFetching: false,
        isUpdating: false,
        currentMessage: ''
    },
    dotPage: {
        items: [],
        isFetching: false,
        isUpdating: false,
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
                    isUpdating: true
                }
            };

        case generateSuccessActionTypeName(CommentsConstants.DOT_PAGE.PUT):
            return {
                ...state,
                dotPage: {
                    ...state.dotPage,
                    items: [...state.dotPage.items, action.payload],
                    isUpdating: false,
                    currentMessage: ''
                }
            };

        case generateErrorActionTypeName(CommentsConstants.DOT_PAGE.PUT):
            return {
                ...state,
                dotPage: {
                    ...state.dotPage,
                    isUpdating: false
                }
            };

        // Dot page - DELETE
        case generateInProgressActionTypeName(CommentsConstants.DOT_PAGE.DELETE):
            return {
                ...state,
                dotPage: {
                    ...state.dotPage,
                    isUpdating: true
                }
            };

        case generateSuccessActionTypeName(CommentsConstants.DOT_PAGE.DELETE):
            return {
                ...state,
                dotPage: {
                    ...state.dotPage,
                    items: state.dotPage.items.filter(comment => comment.id !== action.payload),
                    isUpdating: false
                }
            };

        case generateErrorActionTypeName(CommentsConstants.DOT_PAGE.DELETE):
            return {
                ...state,
                dotPage: {
                    ...state.dotPage,
                    isUpdating: false
                }
            };

        default:
            return state;
    }
};