import {ObjectConstants} from "./UObject.actions";
import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName,
} from "../../middleware/asyncActionsMiddleware";
import isEmpty from "lodash-es/isEmpty";
import { groupImages } from '../../helpers/groupImages';

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
                object: {
                    ...action.payload,
                    groupedImages: groupImages(action.payload.images)
                }
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
                object: {
                    ...action.payload,
                    groupedImages: groupImages(action.payload.images)
                }
            };

        case generateErrorActionTypeName(ObjectConstants.PUT):
            return {
                ...state,
                isUpdating: false
            };

        case ObjectConstants.ADD_IMAGE:
            const updatedImagesOnAdd = {
                ...state.object.images,
                [action.payload.year]: action.payload.key
            };

            return {
                ...state,
                object: {
                    ...state.object,
                    activeYear: action.payload.year,
                    activeImage: action.payload.key,
                    images: updatedImagesOnAdd,
                    groupedImages: groupImages(updatedImagesOnAdd)
                }
            };

        case ObjectConstants.DELETE_IMAGE:
            const updatedImagesOnDelete = { ...state.object.images };
            delete updatedImagesOnDelete[action.payload.year];

            // Once an image deleted, check if there are other images and show the oldest available one
            // If not, show nothing
            const activeYear = !isEmpty(updatedImagesOnDelete) ? Math.min(...Object.keys(updatedImagesOnDelete)) : '';
            const activeImage = !isEmpty(updatedImagesOnDelete) ? updatedImagesOnDelete[activeYear] : '';

            return {
                ...state,
                activeYear,
                activeImage,
                object: {
                    ...state.object,
                    images: updatedImagesOnDelete,
                    groupedImages: groupImages(updatedImagesOnDelete)
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