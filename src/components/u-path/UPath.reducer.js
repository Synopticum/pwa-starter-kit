import {PathConstants} from "./UPath.actions";
import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName,
} from "../../middleware/asyncActionsMiddleware";
import isEmpty from "lodash-es/isEmpty";
import { groupImages } from '../../helpers/groupImages';

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
                path: {
                    ...action.payload,
                    groupedImages: groupImages(action.payload.images)
                }
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
                path: {
                    ...action.payload,
                    groupedImages: groupImages(action.payload.images)
                }
            };

        case generateErrorActionTypeName(PathConstants.PUT):
            return {
                ...state,
                isUpdating: false
            };

        case PathConstants.ADD_IMAGE:
            const updatedImagesOnAdd = {
                ...state.path.images,
                [action.payload.year]: action.payload.key
            };

            return {
                ...state,
                path: {
                    ...state.path,
                    activeYear: action.payload.year,
                    activeImage: action.payload.key,
                    images: updatedImagesOnAdd,
                    groupedImages: groupImages(updatedImagesOnAdd)
                }
            };

        case PathConstants.DELETE_IMAGE:
            const updatedImagesOnDelete = { ...state.path.images };
            delete updatedImagesOnDelete[action.payload.year];

            // Once an image deleted, check if there are other images and show the oldest available one
            // If not, show nothing
            const activeYear = !isEmpty(updatedImagesOnDelete) ? Math.min(...Object.keys(updatedImagesOnDelete)) : '';
            const activeImage = !isEmpty(updatedImagesOnDelete) ? updatedImagesOnDelete[activeYear] : '';

            return {
                ...state,
                activeYear,
                activeImage,
                path: {
                    ...state.path,
                    images: updatedImagesOnDelete,
                    groupedImages: groupImages(updatedImagesOnDelete)
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