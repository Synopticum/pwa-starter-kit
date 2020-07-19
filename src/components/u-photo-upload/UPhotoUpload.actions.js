import {ENV} from "../../../environments/environments";
import {getApiHeadersFormData} from "../../../environments/api";
import {addDotImage, deleteDotImage, setActiveDotImage} from "../u-dot/UDot.actions";
import {addObjectImage, deleteObjectImage, setActiveObjectImage} from "../u-object/UObject.actions";
import {addPathImage, deletePathImage, setActivePathImage} from "../u-path/UPath.actions";

export const UPhotoUploadConstants = {
    PUT: 'PHOTO_UPLOAD_PUT',
    DELETE: 'PHOTO_UPLOAD_DELETE'
};

const _uploadImage = (type, year, jsonKey) => {
    switch (type) {
        case 'dot':
            return addDotImage(year, jsonKey);

        case 'object':
            return addObjectImage(year, jsonKey);

        case 'path':
            return addPathImage(year, jsonKey);
    }
}

const _setActiveImage = (type, year, jsonKey) => {
    switch (type) {
        case 'dot':
            return setActiveDotImage(year, jsonKey);

        case 'object':
            return setActiveObjectImage(year, jsonKey);

        case 'path':
            return setActivePathImage(year, jsonKey);
    }
}

const _deleteImage = (type, year) => {
    switch (type) {
        case 'dot':
            return deleteDotImage(year);

        case 'object':
            return deleteObjectImage(year);

        case 'path':
            return deletePathImage(year);
    }
}

// -------
export const uploadPhoto = (photo, type, year, id) => async (dispatch) => {
    dispatch({
        type: UPhotoUploadConstants.PUT,
        async: true,
        httpMethodToInvoke: _uploadPhoto,
        params: [photo, type, year, id, dispatch]
    });
};

const _uploadPhoto = async (photo, type, year, id, dispatch) => {
    let formData = new FormData();
    formData.append('photo', photo);

    let response = await fetch(`${ENV[window.ENV].api}/api/${type}/${id}/photos/${year}`, {
        method: 'PUT',
        headers: getApiHeadersFormData(localStorage.token),
        body: formData
    });

    if (!response.ok) {
        throw new Error('Error while uploading a dot photo');
    }

    let json = await response.json();

    dispatch(_uploadImage(type, year, json.key));
    dispatch(_setActiveImage(type, year, json.key));

    return json;
};

// -------
export const deletePhoto = (type, id, year) => async (dispatch) => {
    dispatch({
        type: UPhotoUploadConstants.DELETE,
        async: true,
        httpMethodToInvoke: _deletePhoto,
        params: [type, id, year, dispatch]
    });
};

const _deletePhoto = async (type, id, year, dispatch) => {
    let response = await fetch(`${ENV[window.ENV].api}/api/${type}/${id}/photos/${year}`, {
        method: 'DELETE',
        headers: getApiHeadersFormData(localStorage.token)
    });

    if (!response.ok) {
        throw new Error('Error while deleting a dot photo');
    }

    return dispatch(_deleteImage(type, year));
};