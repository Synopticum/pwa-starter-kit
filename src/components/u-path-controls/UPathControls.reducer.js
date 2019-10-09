import {UPathControlsConstants} from "./UPathControls.actions";
import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName
} from "../../middleware/asyncActionsMiddleware";

export const pathControls = (state = {}, action) => {
    switch (action.type) {

        // -------
        case generateInProgressActionTypeName(UPathControlsConstants.FETCH):
            return state;

        case generateSuccessActionTypeName(UPathControlsConstants.FETCH):
            return {
                ...state,
                user: action.payload
            };

        case generateErrorActionTypeName(UPathControlsConstants.FETCH):
            return state;

        // -------
        case UPathControlsConstants.TOGGLE:
            return {
                ...state,
                data: 123
            };

        default:
            return state;
    }
};