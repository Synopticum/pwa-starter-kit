import {UObjectControlsConstants} from "./UObjectControls.actions";
import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName
} from "../../middleware/asyncActionsMiddleware";

export const objectControls = (state = {}, action) => {
    switch (action.type) {

        // -------
        case generateInProgressActionTypeName(UObjectControlsConstants.FETCH):
            return state;

        case generateSuccessActionTypeName(UObjectControlsConstants.FETCH):
            return {
                ...state,
                user: action.payload
            };

        case generateErrorActionTypeName(UObjectControlsConstants.FETCH):
            return state;

        // -------
        case UObjectControlsConstants.TOGGLE:
            return {
                ...state,
                data: 123
            };

        default:
            return state;
    }
};