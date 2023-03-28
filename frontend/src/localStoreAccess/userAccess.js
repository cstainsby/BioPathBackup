// ----------------------------------------------------------------------
// userAccess.js
//  simple wrapper functions for the user information 
//
// NOTE: only information you'd feel safe having public should be stored
//       in this local storage
// ----------------------------------------------------------------------

const getUser = () => {
  return sessionStorage.getItem("signedInUser")
}

const saveUser = (userJson) => {
  console.log("userAccess saveUser: " + userJson); // delete me
  sessionStorage.setItem("signedInUser", userJson)
}

const clearUser = () => {
  sessionStorage.removeItem("signedInUser")
}

export {
  getUser,
  saveUser,
  clearUser
}