import {UNavStatsConstants} from "./UNavStats.actions";
import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName
} from "../../../middleware/asyncActionsMiddleware";

export const stats = (state = { addresses: [] }, action) => {
    switch (action.type) {

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