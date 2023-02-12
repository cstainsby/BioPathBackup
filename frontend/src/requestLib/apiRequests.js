
// ----------------------------------------------------------------------
// requests.js
//  This file will contain a library of functions used to make 
//  requests to the backend
// 
//  each of the get functions will be returning JSON objects 
// ----------------------------------------------------------------------

import getEndpointHeader from "./requestConfig";

// for this file, /api/ is attached to get at the data behind that 
// portion of the backend
let dataSourceAddressHeader = getEndpointHeader() + "api/"


/**
 * Requests pathway data from backend 
 * @param {int} id requested pathway id number
 * @returns response object from backend
 */
async function getPathwayById(id) {
  let endpointExtension = "pathways/" + id;
  let requestUrl = dataSourceAddressHeader + endpointExtension;
  
  try {
    const response = await fetch(requestUrl, {
        headers: {
            "Content-Type": "application/json",
            // TODO: CHANGE HARD-CODED AUTH
            'Authorization': 'Basic ' + btoa("root:root")
        }
    });
    const isResponseJSON = response.headers.get('content-type')?.includes('application/json');
    const responseJSON = isResponseJSON && await response.json();

    // if it is a bad request throw an error
    if(!response.ok) {
      const error = (responseJSON && responseJSON.message) || response.status;
      throw error;
    }

    return responseJSON;

  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getPathways() {
  const endpointExtension = "pathways/";
  const requestUrl = dataSourceAddressHeader + endpointExtension;

  try {
    const response = await fetch(requestUrl, {
        headers: {
            "Content-Type": "application/json",
            // TODO: CHANGE HARD-CODED AUTH
            'Authorization': 'Basic ' + btoa("root:root")
        }
    });
    const isResponseJSON = response.headers.get('content-type')?.includes('application/json');
    const responseJSON = isResponseJSON && await response.json();
    
    // if it is a bad request throw an error
    if(!response.ok) {
      const error = (responseJSON && responseJSON.message) || response.status;
      throw error;
    }
    
    return responseJSON;

  } catch (error) {
    console.log(
      requestUrl + "\n" + 
      error
    );
    return error;
  }
}


async function postPathway(pathwayObj) {
  const methodType = "POST";
  const endpointExtension = "pathways/";
  const requestUrl = dataSourceAddressHeader + endpointExtension;

  try {
    const requestOptions = {
      method: methodType,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pathwayObj)
    };

    const response = await fetch(requestUrl, requestOptions);
    const isResponseJSON = response.headers.get('content-type')?.includes('application/json');
    const responseJSON = isResponseJSON && await response.json();
    
    // if it is a bad request throw an error
    if(!response.ok) {
      const error = (responseJSON && responseJSON.message) || response.status;
      throw error;
    }
    
    return responseJSON;
  } catch(error) {
    console.log(
      requestUrl + "\n" + 
      error
    );
    return error;
  }
}

export { getPathways, getPathwayById, postPathway }