import {UPageConstants} from "./UPage.actions";
import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName
} from "../../middleware/asyncActionsMiddleware";

export const pieceOfState = (state = {}, action) => {
    switch (action.type) {

        // -------
        case generateInProgressActionTypeName(UPageConstants.FETCH):
            return state;

        case generateSuccessActionTypeName(UPageConstants.FETCH):
            return {
                ...state,
                user: action.payload
            };

        case generateErrorActionTypeName(UPageConstants.FETCH):
            return state;

        // -------
        case UPageConstants.TOGGLE:
            return {
                ...state,
                data: 123
            };

        default:
            return state;
    }
};