import {PathConstants} from "./UPath.actions";
import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName,
} from "../../middleware/asyncActionsMiddleware";
import isEmpty from "lodash-es/isEmpty";

export const pathPage = (state = {
    path: { },
    isFetching: false,
    isUpdating: false,
    isLoadingError: false
}, action) => {
    switch (action.type) {
        // GET
        case generateInProgressActionTypeName(PathConstants.FETCH):
            return {
                ...state,
                isFetching: true
            };

        case generateSuccessActionTypeName(PathConstants.FETCH):
            return {
                ...state,
                isFetching: false,
                path: action.payload
            };

        case generateErrorActionTypeName(PathConstants.FETCH):
            return {
                ...state,
                isFetching: false,
                isLoadingError: true
            };

        // PUT
        case generateInProgressActionTypeName(PathConstants.PUT):
            return {
                ...state,
                isUpdating: true,
                pathToBeUpdated: action.payload
            };

        case generateSuccessActionTypeName(PathConstants.PUT):
            return {
                ...state,
                isUpdating: false,
                path: action.payload
            };

        case generateErrorActionTypeName(PathConstants.PUT):
            return {
                ...state,
                isUpdating: false
            };

        case PathConstants.ADD_IMAGE:
            return {
                ...state,
                path: {
                    ...state.path,
                    activeYear: action.payload.year,
                    activeImage: action.payload.key,
                    images: {
                        ...state.path.images,
                        [action.payload.year]: action.payload.key
                    }
                }
            };

        case PathConstants.DELETE_IMAGE:
            const updatedImages = { ...state.path.images };
            delete updatedImages[action.payload.year];

            // Once an image deleted, check if there are other images and show the oldest available one
            // If not, show nothing
            const activeYear = !isEmpty(updatedImages) ? Math.min(...Object.keys(updatedImages)) : '';
            const activeImage = !isEmpty(updatedImages) ? updatedImages[activeYear] : '';

            return {
                ...state,
                activeYear,
                activeImage,
                path: {
                    ...state.path,
                    images: updatedImages
                }
            };

        case PathConstants.SET_ACTIVE_IMAGE:
            return {
                ...state,
                activeImage: action.payload.image,
                activeYear: action.payload.year
            };

        case PathConstants.CLEAR_STATE:
            return {
                path: {},
                isFetching: false,
                isUpdating: false
            };

        default:
            return state;
    }
};