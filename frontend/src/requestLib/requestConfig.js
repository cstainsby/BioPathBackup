// ----------------------------------------------------------------------
// requestConfig.js
//  This file will contain the prefixes of all endpoints that we will
//  be using in the project. There will also be a getter function to 
//  grab the defined endpoint header. All of the request folder will use
//  use the returned definition to direct their calls
//
//  NOTE:
//     All of the endpoints should be the same across the Mock and
//     actual build
// ----------------------------------------------------------------------

/**
 * getter for the user defined endpoint
 * @returns string representation of URL 
 */
function getEndpointHeader() {
  const BACKEND_BASE_API_URL = "http://localhost:8000/"; 
  const MOCK_API_URL = "http://localhost:4000/";
  const AWS_BACKEND_URL = "";

  let definedHeader = BACKEND_BASE_API_URL;

  if (process.env.buildType === "production") {
    // when container pushed to production 
    definedHeader = AWS_BACKEND_URL;
  }
  else if (process.env.buildType === "local mock test") {
    // endpoint for using the frontendJsonTestServer
    definedHeader = MOCK_API_URL;
  }
  else if (process.env.buildType === "local backend") {
    // this is the standard build type for when running the backend 
    //    and local db with the frontend through docker-compose 
    definedHeader = BACKEND_BASE_API_URL;
  }
  
  return definedHeader;
}

export default getEndpointHeader;

