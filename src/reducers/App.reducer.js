import {PAGE, APP} from "../components/u-app/UApp.actions";
import {
    generateInProgressActionTypeName,
    generateSuccessActionTypeName,
    generateErrorActionTypeName
} from "../middleware/asyncActionsMiddleware";

export const app = (state = {}, action) => {
    switch (action.type) {
        case PAGE.UPDATE:
            return {
                ...state,
                page: action.payload.page
            };

        // -------
        case generateInProgressActionTypeName(APP.USER.FETCH):
            // TODO
            return state;

        case generateSuccessActionTypeName(APP.USER.FETCH):
            return {
                ...state,
                user: action.payload
            };

        case generateErrorActionTypeName(APP.USER.FETCH):
            // TODO
            return state;

        default:
            return state;
    }
};