import {AppConstants} from "../components/u-app/UApp.actions";
import {
    generateInProgressActionTypeName,
    generateSuccessActionTypeName,
    generateErrorActionTypeName
} from "../middleware/asyncActionsMiddleware";

export const app = (state = {}, action) => {
    switch (action.type) {
        case AppConstants.PAGE.UPDATE:
            return {
                ...state,
                page: action.payload.page
            };

        // -------
        case generateInProgressActionTypeName(AppConstants.USER.FETCH):
            // TODO
            return state;

        case generateSuccessActionTypeName(AppConstants.USER.FETCH):
            return {
                ...state,
                user: action.payload
            };

        case generateErrorActionTypeName(AppConstants.USER.FETCH):
            // TODO
            return state;

        default:
            return state;
    }
};