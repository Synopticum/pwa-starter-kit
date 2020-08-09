import {ENV} from "../../../environments/environments";
import {getApiHeadersFormData} from "../../../environments/api";
import {addEntityImage, deleteEntityImage, setActiveEntityImage} from "../u-entity/UEntity.actions";

export const UPhotoUploadConstants = {
    PUT: 'PHOTO_UPLOAD_PUT',
    DELETE: 'PHOTO_UPLOAD_DELETE'
};

// -------
export const uploadPhoto = (photo, type, year, id, join) => async (dispatch) => {
    dispatch({
        type: UPhotoUploadConstants.PUT,
        async: true,
        httpMethodToInvoke: _uploadPhoto,
        params: [photo, type, year, id, join, dispatch]
    });
};

const _uploadPhoto = async (photo, type, year, id, join, dispatch) => {
    let formData = new FormData();
    formData.append('photo', photo);

    const yearName = join ? `${join.activeYear}_${join.newYear}` : year;

    let response = await fetch(`${ENV[window.ENV].api}/api/${type}/${id}/photos/${yearName}`, {
        method: 'PUT',
        headers: getApiHeadersFormData(localStorage.token),
        body: formData
    });

    if (!response.ok) {
        throw new Error('Error while uploading a dot photo');
    }

    let json = await response.json();

    dispatch(addEntityImage(type, yearName, json.key));
    dispatch(setActiveEntityImage(type, yearName, json.key));

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

    return dispatch(deleteEntityImage(type, year));
};