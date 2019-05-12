import {ENV} from "../../../environments/environments";
import {getApiHeadersFormData} from "../../../environments/api";

export const UPhotoUploadConstants = {
    PUT: 'PHOTO_UPLOAD_PUT'
};

// -------
export const uploadPhoto = (photo, type, id) => async (dispatch) => {
    dispatch({
        type: UPhotoUploadConstants.PUT,
        async: true,
        httpMethodToInvoke: _uploadPhoto,
        params: [photo, type, id]
    });
};

const _uploadPhoto = async (photo, type, id) => {
    let formData = new FormData();
    formData.append('photo', photo);

    let response = await fetch(`${ENV[window.ENV].api}/api/${type}/${id}/photos`, {
        method: 'PUT',
        headers: getApiHeadersFormData(localStorage.token),
        body: formData
    });

    if (!response.ok) {
        throw new Error('Error while putting a dot');
    }

    let json = await response.json();


    return json;
};