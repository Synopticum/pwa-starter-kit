import {AppConstants} from "../components/u-app/UApp.actions";
import {
    generateInProgressActionTypeName,
    generateSuccessActionTypeName,
    generateErrorActionTypeName
} from "../middleware/asyncActionsMiddleware";

const anonymousUser = Object.freeze({
    role: 'anonymous',
    id: null,
    vkId: null,
    firstName: 'Anonymous',
    lastName: 'User'
});

export const app = (state = {}, action) => {
    switch (action.type) {
        case AppConstants.PAGE.UPDATE:
            return {
                ...state,
                page: action.payload
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

        case AppConstants.USER.ENABLE_ANONYMOUS_MODE:
            return {
                ...state,
                user: anonymousUser
            };

        default:
            return state;
    }
};