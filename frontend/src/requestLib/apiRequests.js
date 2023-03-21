
/**
 * This file will contain a library of functions used to make 
 * requests to the backend
 */

import getEndpointHeader from "./requestConfig";
import { getAccessToken } from "../localStoreAccess/jwtAccess";

// for this file, /api/ is attached to get at the data behind that 
// portion of the backend
let dataSourceAddressHeader = getEndpointHeader() + "api/";

/**
 * Gets data from the backend at a specified endpoint
 * @param {string} endpoint where to get the data from
 * @returns backend response object
 */
async function getBackendData(endpoint) {
    const requestUrl = dataSourceAddressHeader + endpoint;

    const accessToken = getAccessToken();
    let headers = {};
    if (accessToken === "") {
        headers = {"Content-Type": "application/json"};
    } else {
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken
        };
    }

    try {
        const response = await fetch(requestUrl, {headers: headers});
        const isResponseJSON = response.headers.get('content-type')?.includes('application/json');
        const responseJSON = isResponseJSON && await response.json();
        
        // if it is a bad request throw an error
        if(!response.ok) {
            const error = (responseJSON && responseJSON.message) || response.status;
            throw error;
        }

        return responseJSON;

    } catch (error) {
        console.log(requestUrl, error);
        return error;
    }
}

/**
 * Requests pathway data from backend 
 * @param {int} id requested pathway id number
 * @returns response object from backend
 */
async function getPathwayById(id) {
    return getBackendData("pathways/" + id + "/");
}

async function getPathways() {
    return getBackendData("pathways/");
}

async function getEnzymes() {
    return getBackendData("enzymes/");
}

async function getMolecules() {
    return getBackendData("molecules/");
}

/**
 * Submits a POST request to the backend at the
 * specified endpoint, sending the given object
 * @param {Object} obj data to post to the backend
 * @param {string} endpoint where to send the data
 * @returns backend response object
 */
async function postBackendData(obj, endpoint) {
    const methodType = "POST";
    const requestUrl = dataSourceAddressHeader + endpoint;

    const accessToken = getAccessToken();
    let headers = {};
    if (accessToken === "") {
        alert("You must be signed in to save anything you build.");
        headers = {"Content-Type": "application/json"};
    } else {
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken
        };
    }
    console.log("***Headers:" + headers.Authorization);

    try {
        const requestOptions = {
            method: methodType,
            headers: headers,
            body: JSON.stringify(obj)
        };

        const response = await fetch(requestUrl, requestOptions);
        const isResponseJSON = response.headers.get('content-type')?.includes('application/json');
        const responseJSON = isResponseJSON && await response.json();
        
        // if it is a bad request throw an error
        if(!response.ok) {
            const error = (responseJSON && responseJSON.message) || response.status;
            throw error;
        }
        alert("DB updated successfully");
        return responseJSON;
    } catch(error) {
        alert("Pathway had incorrect internals, try again");
        console.log(requestUrl, error, "testststs");
        return error;
    }
}

async function postPathway(pathwayObj) {
    // return postBackendData(pathwayObj, "pathways/");
    const methodType = "POST";
    const requestUrl = dataSourceAddressHeader + "pathways/";

    const accessToken = getAccessToken();
    let headers = {};
    if (accessToken === "") {
        alert("You must be signed in to save anything you build.");
        headers = {"Content-Type": "application/json"};
    } else {
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken
        };
    }

    try {
        const requestOptions = {
            method: methodType,
            headers: headers,
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
        alert("Pathway successfully added to database");
        return responseJSON;
    } catch(error) {
        alert("Pathway had incorrect internals, try again");
        return error;
    }
}

async function postMolecule(moleculeObj) {
    return postBackendData(moleculeObj, "molecules/");
}

async function postEnzyme(enzymeObj) {
    return postBackendData(enzymeObj, "enzymes/");
}

export { getPathways, getPathwayById, postPathway, getEnzymes, getMolecules, postMolecule, postEnzyme }