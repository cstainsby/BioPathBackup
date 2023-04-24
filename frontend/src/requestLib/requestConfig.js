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
    // the frontend's backend requests are directed towards BACKEND_ENDPOINT
    //  which is defined in the enviornment variables
    //  note that this endpoint could be invalid or MISSING, there should be error handling
    //  in our requests

    console.log(process.env);
    // let remoteBackendEndpoint = "https://wtfysc3awc.us-west-2.awsapprunner.com/"
    let definedBackendEndpoint = 'http://localhost:8000/';
    // let definedBackendEndpoint = process.env.REACT_APP_BACKEND_ENDPOINT;

    return definedBackendEndpoint;
}

export default getEndpointHeader;
