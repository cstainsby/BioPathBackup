
// ----------------------------------------------------------------------
// requests.js
//  This file will contain a library of functions used to make 
//  requests to the backend
// 
//  each of the git functions will be returning JSON objects 
// ----------------------------------------------------------------------

BACKEND_BASE_API_URL = "localhost:8000/api/";

function consoleLogRequestResults(status, statusText, endpointExtension, type, data) {
  // This helper function is here to standardize the print output of each request 
  // PARAMS:
  //  status: the status code of the request
  //  type: str describing type of request e.g. POST
  //  data: the JSON object sent or recieved (infered by type) 
  console.log(
    "STATUS OF REQUEST: " + status + "\n" +
    "STATUS TEXT: " + statusText + "\n" + 
    "to endpoint: " + BACKEND_BASE_API_URL + endpointExtension + "\n" +
    "type of request: " + type + "\n" +
    "data: " + data 
  );
}

export default async function getPathwayById(id) {
  let endpointExtension = "pathways/" + id;
  let requestUrl = BACKEND_BASE_API_URL + "";

  try {
    let response = await fetch(requestUrl);
    let responseJSON = await response.json();

    consoleLogRequestResults(
      response.status,
      response.statusText,
      endpointExtension,
      "GET",
      responseJSON
    );
    return responseJSON;
  } catch (error) {
    console.log(error)
  }
}

export default async function getPathways() {
  let endpointExtension = "pathways/";
  let requestUrl = BACKEND_BASE_API_URL + "";

  try {
    let response = await fetch(requestUrl);
    let responseJSON = await response.json();

    consoleLogRequestResults(
      response.status,
      response.statusText,
      endpointExtension,
      "GET",
      responseJSON
    );
    return responseJSON;
  } catch (error) {
    console.log(error)
  }
}