// ----------------------------------------------------------------------
// userAccess.js
//  simple wrapper functions for the user information 
//
// NOTE: only information you'd feel safe having public should be stored
//       in this local storage
// ----------------------------------------------------------------------

const getUser = () => {
  return localStorage.getItem("signedInUser")
}

const saveUser = (userJson) => {
  localStorage.setItem("signedInUser", userJson)
}

const clearUser = () => {
  localStorage.removeItem("signedInUser")
}

export {
  getUser,
  saveUser,
  clearUser
}