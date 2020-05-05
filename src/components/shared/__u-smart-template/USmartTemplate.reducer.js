import {USmartTemplateConstants} from "./USmartTemplate.actions";
import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName
} from "../../../middleware/asyncActionsMiddleware";

export const pieceOfState = (state = {}, action) => {
    switch (action.type) {

        // -------
        case generateInProgressActionTypeName(USmartTemplateConstants.FETCH):
            return state;

        case generateSuccessActionTypeName(USmartTemplateConstants.FETCH):
            return {
                ...state,
                user: action.payload
            };

        case generateErrorActionTypeName(USmartTemplateConstants.FETCH):
            return state;

        // -------
        case USmartTemplateConstants.TOGGLE:
            return {
                ...state,
                data: 123
            };

        default:
            return state;
    }
};