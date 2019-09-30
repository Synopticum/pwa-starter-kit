import {PathConstants} from "./UPath.actions";
import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName,
} from "../../middleware/asyncActionsMiddleware";

export const pathPage = (state = {
    object: { },
    isFetching: false,
    isUpdating: false,
    isLoadingError: false
}, action) => {
    switch (action.type) {
        // GET
        case generateInProgressActionTypeName(PathConstants.FETCH):
            return {
                ...state,
                isFetching: true
            };

        case generateSuccessActionTypeName(PathConstants.FETCH):
            return {
                ...state,
                isFetching: false,
                dot: action.payload
            };

        case generateErrorActionTypeName(PathConstants.FETCH):
            return {
                ...state,
                isFetching: false,
                isLoadingError: true
            };

        // PUT
        case generateInProgressActionTypeName(PathConstants.PUT):
            return {
                ...state,
                isUpdating: true,
                objectToBeUpdated: action.payload
            };

        case generateSuccessActionTypeName(PathConstants.PUT):
            return {
                ...state,
                isUpdating: false,
                object: action.payload
            };

        case generateErrorActionTypeName(PathConstants.PUT):
            return {
                ...state,
                isUpdating: false
            };

        case PathConstants.CLEAR_STATE:
            return {
                object: {},
                isFetching: false,
                isUpdating: false
            };

        default:
            return state;
    }
};