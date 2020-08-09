import { getConstants } from './helpers';

import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName,
} from "../../middleware/asyncActionsMiddleware";
import isEmpty from "../../helpers/isEmpty";
import { groupImages } from '../../helpers/groupImages';

export const createBasePageReducer = (type) => (state = {
    [type]: { },
    isFetching: false,
    isUpdating: false,
    isLoadingError: false
}, action) => {
    const Constants = getConstants(type);
    
    switch (action.type) {
        // GET
        case generateInProgressActionTypeName(Constants.FETCH):
            return {
                ...state,
                isFetching: true
            };

        case generateSuccessActionTypeName(Constants.FETCH):
            return {
                ...state,
                isFetching: false,
                [type]: {
                    ...action.payload,
                    groupedImages: groupImages(action.payload.images)
                }
            };

        case generateErrorActionTypeName(Constants.FETCH):
            return {
                ...state,
                isFetching: false,
                isLoadingError: true
            };

        // PUT
        case generateInProgressActionTypeName(Constants.PUT):
            return {
                ...state,
                isUpdating: true,
                [`${type}ToBeUpdated`]: action.payload
            };

        case generateSuccessActionTypeName(Constants.PUT):
            return {
                ...state,
                isUpdating: false,
                [type]: {
                    ...action.payload,
                    groupedImages: groupImages(action.payload.images)
                }
            };

        case generateErrorActionTypeName(Constants.PUT):
            return {
                ...state,
                isUpdating: false
            };

        case Constants.ADD_IMAGE:
            const updatedImagesOnAdd = {
                ...state[type].images,
                [action.payload.year]: action.payload.key
            };

            return {
                ...state,
                [type]: {
                    ...state[type],
                    activeYear: action.payload.year,
                    activeImage: action.payload.key,
                    images: updatedImagesOnAdd,
                    groupedImages: groupImages(updatedImagesOnAdd)
                }
            };

        case Constants.DELETE_IMAGE:
            const updatedImagesOnDelete = { ...state[type].images };
            delete updatedImagesOnDelete[action.payload.year];

            // Once an image deleted, check if there are other images and show the oldest available one
            // If not, show nothing
            const activeYear = !isEmpty(updatedImagesOnDelete) ? Math.min(...Object.keys(updatedImagesOnDelete)) : '';
            const activeImage = !isEmpty(updatedImagesOnDelete) ? updatedImagesOnDelete[activeYear] : '';

            return {
                ...state,
                activeYear,
                activeImage,
                [type]: {
                    ...state[type],
                    images: updatedImagesOnDelete,
                    groupedImages: groupImages(updatedImagesOnDelete)
                }
            };

        case Constants.SET_ACTIVE_IMAGE:
            return {
                ...state,
                activeImage: action.payload.image,
                activeYear: action.payload.year
            };

        case Constants.CLEAR_STATE:
            return {
                [type]: {},
                isFetching: false,
                isUpdating: false
            };

        default:
            return state;
    }
};