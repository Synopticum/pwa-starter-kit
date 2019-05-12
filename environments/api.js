export const getApiHeaders = (token) => {
    return {
        'Content-Type': 'application/json',
        'Token': token
    }
};

export const getApiHeadersFormData = (token) => {
    return {
        'Token': token
    }
};