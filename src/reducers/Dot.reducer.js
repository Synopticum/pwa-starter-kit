import {DOT} from "../components/u-dot/UDot.actions";
import {
    generateInProgressActionTypeName,
    generateSuccessActionTypeName,
    generateErrorActionTypeName,
} from "../middleware/asyncActionsMiddleware";

export const dotPage = (state = {
    dot: {},
    isFetching: false,
    isUpdating: false
}, action) => {
    switch (action.type) {
        // GET
        case generateInProgressActionTypeName(DOT.FETCH):
            return {
                ...state,
                isFetching: true
            };

        case generateSuccessActionTypeName(DOT.FETCH):
            return {
                ...state,
                isFetching: false,
                dot: action.payload
            };

        case generateErrorActionTypeName(DOT.FETCH):
            return {
                ...state,
                isFetching: false
            };

        // PUT
        case generateInProgressActionTypeName(DOT.PUT):
            return {
                ...state,
                isUpdating: true,
                dotToBeUpdated: action.payload
            };

        case generateSuccessActionTypeName(DOT.PUT):
            return {
                ...state,
                isUpdating: false,
                dot: action.payload
            };

        case generateErrorActionTypeName(DOT.PUT):
            return {
                ...state,
                isUpdating: false
            };

        case DOT.CLEAR_STATE:
            return {
                dot: {},
                isFetching: false,
                isUpdating: false
            };

        default:
            return state;
    }
};