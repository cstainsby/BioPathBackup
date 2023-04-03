// ----------------------------------------------------------------------
// jwtAccess.js
//  simple wrapper functions for the JWTs stored in local storage
// ----------------------------------------------------------------------

/**
 * getter for access token from sessionStorage
 * @returns token or empty string 
 */
const getAccessToken = () => {
  let accessToken = sessionStorage.getItem("access_token");
  
  if (!accessToken || accessToken === "undefined") {
    accessToken = "";
  }
  
  return accessToken;
}

/**
 * getter for refresh token from sessionStorage
 * @returns token string or empty string
 */
const getRefreshToken = () => {
  let refreshToken = sessionStorage.getItem("refresh_token");

  if (!refreshToken || refreshToken === "undefined") {
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
  sessionStorage.setItem("access_token", access_token);
  sessionStorage.setItem("refresh_token", refresh_token);
}

/**
 * used to clear tokens after sign out
 */
const clearTokens = () => {
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
}

export {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens
}