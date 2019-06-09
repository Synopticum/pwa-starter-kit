import {ENV} from "../../../environments/environments";
import {getApiHeadersFormData} from "../../../environments/api";
import {addDotImage,deleteDotImage} from "../u-dot/UDot.actions";

export const UPhotoUploadConstants = {
    PUT: 'PHOTO_UPLOAD_PUT',
    DELETE: 'PHOTO_UPLOAD_DELETE'
};

// -------
export const uploadPhoto = (photo, type, date, id) => async (dispatch) => {
    dispatch({
        type: UPhotoUploadConstants.PUT,
        async: true,
        httpMethodToInvoke: _uploadPhoto,
        params: [photo, type, date, id, dispatch]
    });
};

const _uploadPhoto = async (photo, type, date, id, dispatch) => {
    let formData = new FormData();
    formData.append('photo', photo);

    let response = await fetch(`${ENV[window.ENV].api}/api/${type}/${id}/photos/${date}`, {
        method: 'PUT',
        headers: getApiHeadersFormData(localStorage.token),
        body: formData
    });

    if (!response.ok) {
        throw new Error('Error while uploading a dot photo');
    }

    let json = await response.json();

    dispatch(addDotImage(date, json.key));

    return json;
};

// -------
export const deletePhoto = (type, id, date) => async (dispatch) => {
    dispatch({
        type: UPhotoUploadConstants.DELETE,
        async: true,
        httpMethodToInvoke: _deletePhoto,
        params: [type, id, date, dispatch]
    });
};

const _deletePhoto = async (type, id, date, dispatch) => {
    let response = await fetch(`${ENV[window.ENV].api}/api/${type}/${id}/photos/${date}`, {
        method: 'DELETE',
        headers: getApiHeadersFormData(localStorage.token)
    });

    if (!response.ok) {
        throw new Error('Error while deleting a dot photo');
    }

    return dispatch(deleteDotImage(date));
};