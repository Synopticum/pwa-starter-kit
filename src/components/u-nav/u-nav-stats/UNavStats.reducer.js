import {UNavStatsConstants} from "./UNavStats.actions";
import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName
} from "../../../middleware/asyncActionsMiddleware";

export const stats = (state = { addresses: [] }, action) => {
    switch (action.type) {

        // -------
        case generateInProgressActionTypeName(UNavStatsConstants.FETCH_ADDRESSES):
            return state;

        case generateSuccessActionTypeName(UNavStatsConstants.FETCH_ADDRESSES):
            return {
                ...state,
                addresses: action.payload
            };

        case generateErrorActionTypeName(UNavStatsConstants.FETCH_ADDRESSES):
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