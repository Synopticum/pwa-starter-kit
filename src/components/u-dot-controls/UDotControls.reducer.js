import {UDotControlsConstants} from "./UDotControls.actions";
import {
    generateInProgressActionTypeName,
    generateSuccessActionTypeName,
    generateErrorActionTypeName
} from "../../middleware/asyncActionsMiddleware";

export const dotControls = (state = {}, action) => {
    switch (action.type) {

        // -------
        case generateInProgressActionTypeName(UDotControlsConstants.FETCH):
            return state;

        case generateSuccessActionTypeName(UDotControlsConstants.FETCH):
            return {
                ...state,
                user: action.payload
            };

        case generateErrorActionTypeName(UDotControlsConstants.FETCH):
            return state;

        // -------
        case UDotControlsConstants.TOGGLE:
            return {
                ...state,
                data: 123
            };

        default:
            return state;
    }
};