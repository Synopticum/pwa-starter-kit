import {AppConstants} from "./UApp.actions";
import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName
} from "../../middleware/asyncActionsMiddleware";

const anonymousUser = Object.freeze({
    role: 'anonymous',
    id: null,
    vkId: null,
    firstName: 'Anonymous',
    lastName: 'User'
});

export const app = (state = { user: { avatarsCache: {} }, page: '/' }, action) => {
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
                user: {
                    ...state.user,
                    ...action.payload
                }
            };

        case generateErrorActionTypeName(AppConstants.USER.FETCH):
            // TODO
            return state;

        case AppConstants.USER.UPDATE_AVATARS_CACHE:
            const { authorVkId, avatarUrl } = action.payload;

            if (authorVkId && avatarUrl) {
                return {
                    ...state,
                    user: {
                        ...state.user,
                        avatarsCache: {
                            ...state.user.avatarsCache,
                            [authorVkId]: avatarUrl
                        }
                    }
                };
            }

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