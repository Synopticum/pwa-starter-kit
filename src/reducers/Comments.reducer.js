//
// Reducer
//
import {COMMENTS} from "../components/u-comments/UComments.actions";
import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName
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
        case generateInProgressActionTypeName(COMMENTS.DOT_PAGE.FETCH):
            return {
                ...state,
                dotPage: {
                    ...state.dotPage,
                    isFetching: true
                }
            };

        case generateSuccessActionTypeName(COMMENTS.DOT_PAGE.FETCH):
            return {
                ...state,
                dotPage: {
                    ...state.dotPage,
                    items: action.payload,
                    isFetching: false
                }
            };

        case generateErrorActionTypeName(COMMENTS.DOT_PAGE.FETCH):
            return {
                ...state,
                dotPage: {
                    ...state.dotPage,
                    isFetching: false
                }
            };

        // Dot page - PUT
        case COMMENTS.DOT_PAGE.PUT.REQUEST:
            return {
                ...state,
                dotPage: {
                    ...state.dotPage,
                    isUpdating: true
                }
            };

        case COMMENTS.DOT_PAGE.PUT.SUCCESS:
            return {
                ...state,
                dotPage: {
                    ...state.dotPage,
                    items: [...state.dotPage.items, action.payload],
                    isUpdating: false,
                    currentMessage: ''
                }
            };

        case COMMENTS.DOT_PAGE.PUT.FAILURE:
            return {
                ...state,
                dotPage: {
                    ...state.dotPage,
                    isUpdating: false
                }
            };

        // Dot page - DELETE
        case COMMENTS.DOT_PAGE.DELETE.REQUEST:
            return {
                ...state,
                dotPage: {
                    ...state.dotPage,
                    isUpdating: true
                }
            };

        case COMMENTS.DOT_PAGE.DELETE.SUCCESS:
            return {
                ...state,
                dotPage: {
                    ...state.dotPage,
                    items: state.dotPage.items.filter(comment => comment.id !== action.payload),
                    isUpdating: false
                }
            };

        case COMMENTS.DOT_PAGE.DELETE.FAILURE:
            return {
                ...state,
                dotPage: {
                    ...state.dotPage,
                    isUpdating: false
                }
            };

        case COMMENTS.DOT_PAGE.TYPE:
            return {
                ...state,
                dotPage: {
                    ...state.dotPage,
                    currentMessage: action.payload
                }
            };

        default:
            return state;
    }
};