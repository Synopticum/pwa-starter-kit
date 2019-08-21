import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName
} from "../../middleware/asyncActionsMiddleware";
import {UPhotoUploadConstants} from "./UPhotoUpload.actions";

export const photoUpload = (state = {
    isUploading: false
}, action) => {
    switch (action.type) {

        // -------
        case generateInProgressActionTypeName(UPhotoUploadConstants.PUT):
            return {
                ...state,
                isUploading: true
            };

        case generateSuccessActionTypeName(UPhotoUploadConstants.PUT):
            return {
                ...state,
                isUploading: false,
                response: action.payload
            };

        case generateErrorActionTypeName(UPhotoUploadConstants.PUT):
            // TODO
            return {
                ...state,
                isUploading: false
            };

        default:
            return state;
    }
};