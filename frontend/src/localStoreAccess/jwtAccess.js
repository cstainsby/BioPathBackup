// ----------------------------------------------------------------------
// jwtAccess.js
//  simple wrapper functions for the JWTs stored in local storage
// ----------------------------------------------------------------------


const getAccessToken = () => {
  return localStorage.getItem("access_token")
}

const getRefreshToken = () => {
  return localStorage.getItem("refresh_token")
}

const saveTokens = (access_token, refresh_token) => {
  localStorage.setItem("access_token", access_token)
  localStorage.setItem("refresh_token", refresh_token)
}

const clearTokens = () => {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
}

export {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens
}