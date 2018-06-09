export async function authenticate() {
  let code = getCode();

  if (code) {
    return await checkIfCodeIsValid(code);
  }
  throw new Error('No auth code');
}

function getCode() {
  if (localStorage.auth_code) {
    return localStorage.auth_code;
  }

  if (location.search) {
    return new URLSearchParams(location.search.slice(1)).get('code');
  }

  return '';
}

async function checkIfCodeIsValid(code) {
  let response = await fetch(`http://localhost:3000/api/authenticate?code=${code}`);
  let json = await response.json();

  if (json.error) {
    localStorage.auth_code = '';
    throw new Error('Auth code is invalid');
  }

  return code;
}