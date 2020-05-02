import {UNavConstants} from "./UNav.actions";
import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName
} from "../../middleware/asyncActionsMiddleware";

export const pieceOfState = (state = {}, action) => {
    switch (action.type) {

        // -------
        case generateInProgressActionTypeName(UNavConstants.FETCH):
            return state;

        case generateSuccessActionTypeName(UNavConstants.FETCH):
            return {
                ...state,
                user: action.payload
            };

        case generateErrorActionTypeName(UNavConstants.FETCH):
            return state;

        // -------
        case UNavConstants.TOGGLE:
            return {
                ...state,
                data: 123
            };

        default:
            return state;
    }
};