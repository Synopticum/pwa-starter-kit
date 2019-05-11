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
    return new Promise((resolve, reject) => {
        window.s3.upload({
            Key: key,
            Body: photo,
            ACL: 'public-read'
        }, (err, data) => {
            if (err) {
                console.error('There was an error uploading your photo: ', err.message);
                reject(err.message);
            }

            resolve(data);
        });
    });
};