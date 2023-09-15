/**
 * This file will contain a library of functions used to make
 * requests to the backend
 */

import getEndpointHeader from './requestConfig';
import { getAccessToken } from '../localStoreAccess/jwtAccess';

// for this file, /api/ is attached to get at the data behind that
// portion of the backend
const getDataSourceAddressHeader = getEndpointHeader() + 'api/';

/**
 * Gets data from the backend at a specified endpoint
 * @param {string} endpoint where to get the data from
 * @returns backend response object
 */
async function getBackendData(endpoint) {
    const requestUrl = getDataSourceAddressHeader + endpoint;

    const accessToken = getAccessToken();
    let headers = {};
    if (accessToken === '') {
        headers = { 'Content-Type': 'application/json' };
    } else {
        headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
            // 'Authorization': 'Basic ' + btoa("root:root") // uncomment if getting 401 errors on GET requests
        };
    }

    try {
        const response = await fetch(requestUrl, { headers: headers });
        const isResponseJSON = response.headers
            .get('content-type')
            ?.includes('application/json');
        const responseJSON = isResponseJSON && (await response.json());

        // if it is a bad request throw an error
        if (!response.ok) {
            const error =
                (responseJSON && responseJSON.message) || response.status;
            throw error;
        }

        return responseJSON;
    } catch (error) {
        alert(error);
    }
}

/**
 * Requests pathway data from backend
 * @param {int} id requested pathway id number
 * @returns response object from backend
 */
async function getPathwayById(id) {
    return getBackendData('pathways/' + id + '/');
}

async function getPathways() {
    return getBackendData('pathways/');
}

async function getEnzymes() {
    return getBackendData('enzymes/');
}

async function getMolecules() {
    return getBackendData('molecules/');
}

/**
 * Submits a POST request to the backend at the
 * specified endpoint, sending the given object
 * @param {Object} obj data to post to the backend
 * @param {string} endpoint where to send the data
 * @returns backend response object
 */
async function postBackendData(obj, endpoint, successMessage, failMessage) {
    const methodType = 'POST';
    const requestUrl = getDataSourceAddressHeader + endpoint;

    const accessToken = getAccessToken();
    let headers = {};
    if (accessToken === '') {
        alert('You must be signed in to save anything you build.');
        headers = { 'Content-Type': 'application/json' };
    } else {
        headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
        };
    }

    try {
        const requestOptions = {
            method: methodType,
            headers: headers,
            body: JSON.stringify(obj),
        };

        const response = await fetch(requestUrl, requestOptions);
        const isResponseJSON = response.headers
            .get('content-type')
            ?.includes('application/json');
        const responseJSON = isResponseJSON && (await response.json());

        // if it is a bad request throw an error
        if (!response.ok) {
            const error =
                (responseJSON && responseJSON.message) || response.status;
            throw error;
        }
        alert(successMessage);
        return responseJSON;
    } catch (error) {
        alert(failMessage);
    }
}

async function postPathway(pathwayObj) {
    const successMessage = 'DB updated successfully';
    const failMessage = 'Pathway had incorrect internals, try again';
    return postBackendData(
        pathwayObj,
        'pathways/',
        successMessage,
        failMessage
    );
}

async function postMolecule(moleculeObj) {
    const successMessage = 'Molecule successfully added to DB';
    const failMessage = 'Molecule add failed, try again';
    return postBackendData(
        moleculeObj,
        'molecules/',
        successMessage,
        failMessage
    );
}

async function postEnzyme(enzymeObj) {
    const successMessage = 'Enzyme successfully added to DB';
    const failMessage = 'Enzyme add failed, try again';
    return postBackendData(enzymeObj, 'enzymes/', successMessage, failMessage);
}

async function deletePathway(pathwayID) {
    const methodType = 'DELETE';
    const requestUrl =
        getDataSourceAddressHeader + 'pathways/' + pathwayID + '/';

    const accessToken = getAccessToken();
    let headers = {};
    if (accessToken === '') {
        headers = { 'Content-Type': 'application/json' };
    } else {
        headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
        };
    }

    try {
        const requestOptions = {
            method: methodType,
            headers: headers,
            body: JSON.stringify(pathwayID),
        };

        const response = await fetch(requestUrl, requestOptions);
        const isResponseJSON = response.headers
            .get('content-type')
            ?.includes('application/json');
        const responseJSON = isResponseJSON && (await response.json());

        // if it is a bad request throw an error
        if (!response.ok) {
            const error =
                (responseJSON && responseJSON.message) || response.status;
            throw error;
        }
        return responseJSON;
    } catch (error) {
        alert('Pathway not deleted');
    }
}

async function updatePathway(pathwayID, pathwayObj) {
    const methodType = 'PUT';
    const requestUrl =
        getDataSourceAddressHeader + 'pathways/' + pathwayID + '/';

    const accessToken = getAccessToken();
    let headers = {};
    if (accessToken === '') {
        headers = { 'Content-Type': 'application/json' };
    } else {
        headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
        };
    }

    try {
        const requestOptions = {
            method: methodType,
            headers: headers,
            body: JSON.stringify(pathwayObj),
        };

        const response = await fetch(requestUrl, requestOptions);
        const isResponseJSON = response.headers
            .get('content-type')
            ?.includes('application/json');
        const responseJSON = isResponseJSON && (await response.json());

        // if it is a bad request throw an error
        if (!response.ok) {
            const error =
                (responseJSON && responseJSON.message) || response.status;
            throw error;
        }
        alert('Pathway Updated Successfully');
        return responseJSON;
    } catch (error) {
        alert('Pathway not updated');
        return error;
    }
}

export {
    getPathways,
    getPathwayById,
    postPathway,
    getEnzymes,
    getMolecules,
    postMolecule,
    postEnzyme,
    deletePathway,
    updatePathway,
};
