import {UNavSearchConstants} from "./UNavSearch.actions";
import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName
} from "../../../middleware/asyncActionsMiddleware";

export const searchResults = (state = [], action) => {
    switch (action.type) {

        // -------
        case generateInProgressActionTypeName(UNavSearchConstants.SEARCH):
            return state;

        case generateSuccessActionTypeName(UNavSearchConstants.SEARCH):
            return action.payload;

        case generateErrorActionTypeName(UNavSearchConstants.SEARCH):
            return state;

        // -------
        case UNavSearchConstants.CLEAR:
            return [];

        default:
            return state;
    }
};
