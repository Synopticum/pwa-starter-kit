import isEmpty from 'lodash-es/isEmpty';
import {DotConstants} from "../components/u-dot/UDot.actions";
import {
    generateInProgressActionTypeName,
    generateSuccessActionTypeName,
    generateErrorActionTypeName,
} from "../middleware/asyncActionsMiddleware";

export const dotPage = (state = {
    dot: { },
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
                    images: {
                        ...state.dot.images,
                        [action.payload.decade]: action.payload.key
                    }
                }
            };

        case DotConstants.DELETE_IMAGE:
            const updatedImages = { ...state.dot.images };
            delete updatedImages[action.payload.decade];

            // Once an image deleted, check if there are other images and show the oldest available one
            // If not, show nothing
            const activeDecade = !isEmpty(updatedImages) ? Math.min(...Object.keys(updatedImages)) : '';
            const activeImage = !isEmpty(updatedImages) ? updatedImages[activeDecade] : '';
            debugger;

            return {
                ...state,
                dot: {
                    ...state.dot,
                    activeDecade,
                    activeImage,
                    images: {
                        ...state.dot.images,
                        [action.payload.decade]: undefined
                    }
                }
            };

        case DotConstants.CHANGE_ACTIVE_IMAGE:
            return {
                ...state,
                dot: {
                    ...state.dot,
                    activeImage: action.payload.image,
                    activeDecade: action.payload.decade
                }
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