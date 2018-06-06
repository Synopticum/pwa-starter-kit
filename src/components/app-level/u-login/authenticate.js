export async function authenticate() {
  let accessToken = getAccessToken();

  if (accessToken) {
    return await checkIfAccessTokenValid(accessToken);
  }

  throw new Error('No access token');

  async function checkIfAccessTokenValid(accessToken) {
    const headers = new Headers();
    headers.append('vk-access-token', accessToken);

    let response = await fetch(`http://localhost:3000/api/login/check`, { headers });
    let json = await response.json();

    if (json.error) {
      throw new Error('Access token is invalid');
    }

    return accessToken;
  }
}

function getAccessToken() {
  if (extractAccessTokenFromHash()) {
    return extractAccessTokenFromHash();
  }

  if (localStorage.access_token) {
    return localStorage.access_token;
  }

  return '';
}

function extractAccessTokenFromHash() {
  let hash = window.location.hash.substring(1);
  let params = {};

  hash.split('&').map(hk => {
    let temp = hk.split('=');
    params[temp[0]] = temp[1];
  });

  if (!params || !params.access_token) {
    return '';
  }

  return params.access_token;
}