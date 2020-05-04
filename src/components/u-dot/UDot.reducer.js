import isEmpty from 'lodash-es/isEmpty';
import {DotConstants} from "./UDot.actions";
import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName,
} from "../../middleware/asyncActionsMiddleware";

export const dotPage = (state = {
    dot: { },
    activeImage: '',
    activeYear: '',
    isFetching: false,
    isUpdating: false,
    isLoadingError: false
}, action) => {
    switch (action.type) {
        // GET
        case generateInProgressActionTypeName(DotConstants.FETCH):
            return {
                ...state,
                isFetching: true
            };

        case generateSuccessActionTypeName(DotConstants.FETCH):
            return {
                ...state,
                isFetching: false,
                dot: action.payload
            };

        case generateErrorActionTypeName(DotConstants.FETCH):
            return {
                ...state,
                isFetching: false,
                isLoadingError: true
            };

        // PUT
        case generateInProgressActionTypeName(DotConstants.PUT):
            return {
                ...state,
                isUpdating: true,
                dotToBeUpdated: action.payload
            };

        case generateSuccessActionTypeName(DotConstants.PUT):
            return {
                ...state,
                isUpdating: false,
                dot: action.payload
            };

        case generateErrorActionTypeName(DotConstants.PUT):
            return {
                ...state,
                isUpdating: false
            };

        case DotConstants.ADD_IMAGE:
            return {
                ...state,
                dot: {
                    ...state.dot,
                    activeYear: action.payload.year,
                    activeImage: action.payload.key,
                    images: {
                        ...state.dot.images,
                        [action.payload.year]: action.payload.key
                    }
                }
            };

        case DotConstants.DELETE_IMAGE:
            const updatedImages = { ...state.dot.images };
            delete updatedImages[action.payload.year];

            // Once an image deleted, check if there are other images and show the oldest available one
            // If not, show nothing
            const activeYear = !isEmpty(updatedImages) ? Math.min(...Object.keys(updatedImages)) : '';
            const activeImage = !isEmpty(updatedImages) ? updatedImages[activeYear] : '';

            return {
                ...state,
                activeYear,
                activeImage,
                dot: {
                    ...state.dot,
                    images: updatedImages
                }
            };

        case DotConstants.SET_ACTIVE_IMAGE:
            return {
                ...state,
                activeImage: action.payload.image,
                activeYear: action.payload.year
            };

        case DotConstants.CLEAR_STATE:
            return {
                dot: {},
                isFetching: false,
                isUpdating: false
            };

        default:
            return state;
    }
};