export const UPhotoUploadConstants = {
    PUT: 'PHOTO_UPLOAD_PUT'
};

AWS.config.update({
    region: 'eu-central-1',
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'eu-central-1:c880c423-e2a8-44ed-b0ff-15aff6ce0644'
    })
});

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: { Bucket: 'urussu' }
});

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
        s3.upload({
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