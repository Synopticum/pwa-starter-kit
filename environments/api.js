export const getApiHeaders = (token) => {
    return {
        'Content-Type': 'application/json',
        'Token': token
    }
};