import {
    generateErrorActionTypeName,
    generateInProgressActionTypeName,
    generateSuccessActionTypeName
} from "../middleware/asyncActionsMiddleware";
import {UPhotoUploadConstants} from "../components/u-photo-upload/UPhotoUpload.actions";

export const photoUpload = (state = {
    isFetching: false,
    isUpdating: false,
    isLoadingError: false
}, action) => {
    switch (action.type) {

        // -------
        case generateInProgressActionTypeName(UPhotoUploadConstants.PUT):
            return state;

        case generateSuccessActionTypeName(UPhotoUploadConstants.PUT):
            return {
                ...state,
                uploaded: action.payload
            };

        case generateErrorActionTypeName(UPhotoUploadConstants.PUT):
            return state;

        default:
            return state;
    }
};