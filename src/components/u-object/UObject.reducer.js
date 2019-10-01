import {ObjectConstants} from "./UObject.actions";
import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName,
} from "../../middleware/asyncActionsMiddleware";

export const objectPage = (state = {
    object: { },
    isFetching: false,
    isUpdating: false,
    isLoadingError: false
}, action) => {
    switch (action.type) {
        // GET
        case generateInProgressActionTypeName(ObjectConstants.FETCH):
            return {
                ...state,
                isFetching: true
            };

        case generateSuccessActionTypeName(ObjectConstants.FETCH):
            return {
                ...state,
                isFetching: false,
                object: action.payload
            };

        case generateErrorActionTypeName(ObjectConstants.FETCH):
            return {
                ...state,
                isFetching: false,
                isLoadingError: true
            };

        // PUT
        case generateInProgressActionTypeName(ObjectConstants.PUT):
            return {
                ...state,
                isUpdating: true,
                objectToBeUpdated: action.payload
            };

        case generateSuccessActionTypeName(ObjectConstants.PUT):
            return {
                ...state,
                isUpdating: false,
                object: action.payload
            };

        case generateErrorActionTypeName(ObjectConstants.PUT):
            return {
                ...state,
                isUpdating: false
            };

        case ObjectConstants.CLEAR_STATE:
            return {
                object: {},
                isFetching: false,
                isUpdating: false
            };

        default:
            return state;
    }
};