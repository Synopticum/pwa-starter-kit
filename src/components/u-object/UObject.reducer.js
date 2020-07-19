import {ObjectConstants} from "./UObject.actions";
import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName,
} from "../../middleware/asyncActionsMiddleware";
import isEmpty from "lodash-es/isEmpty";

export const objectPage = (state = {
    object: { },
    isFetching: false,
    isUpdating: false,
    isLoadingError: false
}, action) => {
    switch (action.type) {
        // GET
        case generateInProgressActionTypeName(ObjectConstants.FETCH):
            return {
                ...state,
                isFetching: true
            };

        case generateSuccessActionTypeName(ObjectConstants.FETCH):
            return {
                ...state,
                isFetching: false,
                object: action.payload
            };

        case generateErrorActionTypeName(ObjectConstants.FETCH):
            return {
                ...state,
                isFetching: false,
                isLoadingError: true
            };

        // PUT
        case generateInProgressActionTypeName(ObjectConstants.PUT):
            return {
                ...state,
                isUpdating: true,
                objectToBeUpdated: action.payload
            };

        case generateSuccessActionTypeName(ObjectConstants.PUT):
            return {
                ...state,
                isUpdating: false,
                object: action.payload
            };

        case generateErrorActionTypeName(ObjectConstants.PUT):
            return {
                ...state,
                isUpdating: false
            };

        case ObjectConstants.ADD_IMAGE:
            return {
                ...state,
                object: {
                    ...state.object,
                    activeYear: action.payload.year,
                    activeImage: action.payload.key,
                    images: {
                        ...state.object.images,
                        [action.payload.year]: action.payload.key
                    }
                }
            };

        case ObjectConstants.DELETE_IMAGE:
            const updatedImages = { ...state.object.images };
            delete updatedImages[action.payload.year];

            // Once an image deleted, check if there are other images and show the oldest available one
            // If not, show nothing
            const activeYear = !isEmpty(updatedImages) ? Math.min(...Object.keys(updatedImages)) : '';
            const activeImage = !isEmpty(updatedImages) ? updatedImages[activeYear] : '';

            return {
                ...state,
                activeYear,
                activeImage,
                object: {
                    ...state.object,
                    images: updatedImages
                }
            };

        case ObjectConstants.SET_ACTIVE_IMAGE:
            return {
                ...state,
                activeImage: action.payload.image,
                activeYear: action.payload.year
            };

        case ObjectConstants.CLEAR_STATE:
            return {
                object: {},
                isFetching: false,
                isUpdating: false
            };

        default:
            return state;
    }
};