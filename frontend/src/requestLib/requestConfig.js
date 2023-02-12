// ----------------------------------------------------------------------
// requestConfig.js
//  This file will contain the definitions of all endpoints that we will
//  be using in the project. There will also be a getter function to 
//  grab the defined endpoint header. All of the request folder will use
//  use the returned definition to direct their calls
//
//  NOTE:
//     All of the endpoints should be the same across the Mock and
//     actual build
// ----------------------------------------------------------------------S

const BACKEND_BASE_API_URL = "http://localhost:8000/"; 
const MOCK_API_URL = "http://localhost:4000/";

const userDefinedURL = BACKEND_BASE_API_URL;

/**
 * getter for the user defined endpoint
 * @returns string representation of URL 
 */
function getEndpointHeader() {
  return userDefinedURL;
}

