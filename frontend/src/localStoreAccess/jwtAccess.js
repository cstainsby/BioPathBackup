// ----------------------------------------------------------------------
// jwtAccess.js
//  simple wrapper functions for the JWTs stored in local storage
// ----------------------------------------------------------------------

/**
 * getter for access token from localStorage
 * @returns token or empty string 
 */
const getAccessToken = () => {
  const accessToken = localStorage.getItem("access_token")

  if (!accessToken) {
    accessToken = "";
  } 
  return accessToken;
}

/**
 * getter for refresh token from localStorage
 * @returns token string or empty string
 */
const getRefreshToken = () => {
  const refreshToken = localStorage.getItem("refresh_token")

  if (!refreshToken) {
    refreshToken = "";
  }
  return refreshToken;
}

/**
 * setter for access tokens
 * @param {string} access_token 
 * @param {string} refresh_token 
 */
const saveTokens = (access_token, refresh_token) => {
  localStorage.setItem("access_token", access_token)
  localStorage.setItem("refresh_token", refresh_token)
}

/**
 * used to clear tokens after sign out
 */
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