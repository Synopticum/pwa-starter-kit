import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName
} from "../../../middleware/asyncActionsMiddleware";
import {getConstants} from './helpers';

export const createEntityControlsReducer = (type) => (state = {}, action) => {
    const Constants = getConstants(type);

    switch (action.type) {

        // -------
        case generateInProgressActionTypeName(Constants.FETCH):
            return state;

        case generateSuccessActionTypeName(Constants.FETCH):
            return {
                ...state,
                user: action.payload
            };

        case generateErrorActionTypeName(Constants.FETCH):
            return state;

        // -------
        case Constants.TOGGLE:
            return {
                ...state,
                data: 123
            };

        default:
            return state;
    }
};