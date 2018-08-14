import { ENV } from '../../../constants';

export async function authenticate() {
  let token = await getToken();

  if (token) {
    await isTokenValid(token);
    localStorage.token = token;
    return token;
  }

  throw new Error('No token found, please login');

  async function getToken() {
    if (localStorage.token) {
      return localStorage.token;
    }

    if (location.search) {
      let code = new URLSearchParams(location.search.slice(1)).get('code');

      if (code) {
        let token = await getNewToken(code);
        return token;
      }
    }

    return '';
  }

  async function isTokenValid(token) {
    let response = await fetch(`${ENV.api}/api/checkToken?token=${token}`);
    let json = await response.json();

    if (json.error) {
      localStorage.token = '';
      throw new Error('Token is invalid');
    }

    return token;
  }

  async function getNewToken(code) {
    let response = await fetch(`${ENV.api}/api/authenticate?code=${code}`);
    let json = await response.json();

    if (json.error) {
      localStorage.token = '';
      throw new Error('Cannot get new token, the auth code is invalid');
    }

    return json.token;
  }
}