// ----------------------------------------------------------------------
// jwtAccess.js
//  simple wrapper functions for the JWTs stored in local storage
// ----------------------------------------------------------------------

/**
 * getter for access token from localStorage
 * @returns token or empty string 
 */
const getAccessToken = () => {
  let accessToken = localStorage.getItem("access_token");
  
  if (!accessToken || accessToken === "undefined") {
    accessToken = "";
  }
  
  return accessToken;
}

/**
 * getter for refresh token from localStorage
 * @returns token string or empty string
 */
const getRefreshToken = () => {
  let refreshToken = localStorage.getItem("refresh_token");

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
  console.log("11111"); // delete me
  localStorage.setItem("access_token", access_token);
  localStorage.setItem("refresh_token", refresh_token);
  console.log("22222"); // delete me
}

/**
 * used to clear tokens after sign out
 */
const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens
}