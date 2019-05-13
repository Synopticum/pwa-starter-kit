import {ENV} from "../../../environments/environments";
import {getApiHeadersFormData} from "../../../environments/api";
import {addDotImage,deleteDotImage} from "../u-dot/UDot.actions";

export const UPhotoUploadConstants = {
    PUT: 'PHOTO_UPLOAD_PUT',
    DELETE: 'PHOTO_UPLOAD_DELETE'
};

// -------
export const uploadPhoto = (photo, type, id) => async (dispatch) => {
    dispatch({
        type: UPhotoUploadConstants.PUT,
        async: true,
        httpMethodToInvoke: _uploadPhoto,
        params: [photo, type, id, dispatch]
    });
};

const _uploadPhoto = async (photo, type, id, dispatch) => {
    let formData = new FormData();
    formData.append('photo', photo);

    let response = await fetch(`${ENV[window.ENV].api}/api/${type}/${id}/photos`, {
        method: 'PUT',
        headers: getApiHeadersFormData(localStorage.token),
        body: formData
    });

    if (!response.ok) {
        throw new Error('Error while uploading a dot photo');
    }

    let json = await response.json();

    dispatch(addDotImage(json.key));

    return json;
};

// -------
export const deletePhoto = (type, id, key) => async (dispatch) => {
    dispatch({
        type: UPhotoUploadConstants.DELETE,
        async: true,
        httpMethodToInvoke: _deletePhoto,
        params: [type, id, key, dispatch]
    });
};

const _deletePhoto = async (type, id, key, dispatch) => {
    let response = await fetch(`${ENV[window.ENV].api}/api/${type}/${id}/photos`, {
        method: 'POST',
        headers: getApiHeadersFormData(localStorage.token),
        body: key
    });

    if (!response.ok) {
        throw new Error('Error while deleting a dot photo');
    }

    let json = await response.json();

    dispatch(deleteDotImage(json.key));

    return json;
};