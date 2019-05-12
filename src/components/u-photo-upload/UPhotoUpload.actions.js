import {ENV} from "../../../environments/environments";
import {getApiHeadersFormData} from "../../../environments/api";

export const UPhotoUploadConstants = {
    PUT: 'PHOTO_UPLOAD_PUT'
};

// -------
export const uploadPhoto = (photo, key) => async (dispatch) => {
    dispatch({
        type: UPhotoUploadConstants.PUT,
        async: true,
        httpMethodToInvoke: _uploadPhoto,
        params: [photo, key]
    });
};

const _uploadPhoto = async (photo, key) => {
    let formData = new FormData();
    formData.append('photo', photo);
    formData.append('key', key);

    let response = await fetch(`${ENV[window.ENV].api}/api/upload`, {
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