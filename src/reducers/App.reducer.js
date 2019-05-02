import {PAGE, USER} from "../components/u-app/UApp.actions";

export const app = (state = {}, action) => {
    switch (action.type) {
        case PAGE.UPDATE:
            return {
                ...state,
                page: action.payload.page
            };

        case USER.GET:
            return {
                ...state,
                user: action.payload
            };

        default:
            return state;
    }
};