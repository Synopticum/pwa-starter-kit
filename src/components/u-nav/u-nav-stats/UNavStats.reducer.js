import {UNavStatsConstants} from "./UNavStats.actions";
import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName
} from "../../../middleware/asyncActionsMiddleware";

export const pieceOfState = (state = {}, action) => {
    switch (action.type) {

        // -------
        case generateInProgressActionTypeName(UNavStatsConstants.FETCH):
            return state;

        case generateSuccessActionTypeName(UNavStatsConstants.FETCH):
            return {
                ...state,
                user: action.payload
            };

        case generateErrorActionTypeName(UNavStatsConstants.FETCH):
            return state;

        // -------
        case UNavStatsConstants.TOGGLE:
            return {
                ...state,
                data: 123
            };

        default:
            return state;
    }
};