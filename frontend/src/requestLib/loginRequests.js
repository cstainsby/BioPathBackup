
import getEndpointHeader from "./requestConfig";

// for this file, nothing attached like there is an attachment for the api/
let dataSourceAddressHeader = getEndpointHeader() 


/**
 * register a new user
 * @param {string} username 
 * @param {string} password 
 * @returns res returned by post
 */
const register = async (username, password) => {
  let endpointExtension = "api/register/"
  let requestUrl = dataSourceAddressHeader + endpointExtension;

  const data = {
    "username": username,
    "password": password
  }

  const res = fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .catch(err => console.log(err))
  
  return res
}

/**
 * This is a function which should be responsible for logging in a user 
 * If the user is successfully logged in then the auth token generated by django 
 * will be placed in localStorage under "token"
 * @param {string} username 
 * @param {string} password
 */
const login = async (username, password) => {
  let endpointExtension = "api/api-token-auth/"
  let requestUrl = dataSourceAddressHeader + endpointExtension;

  const data = {
    "username": username,
    "password": password
  }

  const resData = fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => {
        return data
      })
      .catch(err => console.error(err));
      
  return resData
} 

export {
  register,
  login
}