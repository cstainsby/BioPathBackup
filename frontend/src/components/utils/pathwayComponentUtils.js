/* basic function where if concentration[i] greater than previous you subtract
from i - 1 and add to i
*/
export function runConcentrations (concentrations, filled) {
    for (let i = 0; i < concentrations.length; i++) {
        if (i > 0) { 
            // if concentrations are not first or last egde
            if (concentrations[i - 1] < 5) { // concentration to low for reaction to occur
                concentrations[i] = 0;
            }
            else if (concentrations[i - 1] > concentrations[i]) {
                concentrations[i-1] = concentrations[i-1] - .05;
                concentrations[i] = concentrations[i] + .05;
            }
            else if (concentrations[i - 1] < concentrations[i]) { // TODO:
                // if reaction is reversible, molecule at (i) converted to molecule at (i-1)
            }
        }
    }
    return concentrations;
}

/* function that deals with reversible reaction
*/
export function run (concentrations, reversibleSteps, factors, factorSteps) {
    
    for (let i = 0; i < concentrations.length; i++) {
        if (factorSteps.includes(i)) { // dependent on cofactor
            if (i === 0) { // starting step
                concentrations[i] += .01; // always add constant value to start
                if (factors[factorSteps.indexOf(i)] > 0) { // if cofactor present
                    concentrations[i]-= .01 * factors[factorSteps.indexOf(i)];
                }
            }
            else if (i < concentrations.length - 1) { // middle steps
                if (concentrations[i - 1] >= concentrations[i]) { // flows down
                    concentrations[i] += .01 * factors[factorSteps.indexOf(i)];
                    if (concentrations[i - 1] !== 0) { // check if 0 because 0 already subtracted
                        concentrations[i - 1] -= .01 * factors[factorSteps.indexOf(i)];
                    }
                }
                else if (reversibleSteps.includes(i)) { // it is a reversible step
                    concentrations[i] -= .01 * factors[factorSteps.indexOf(i)];
                    concentrations[i - 1] += .01 * factors[factorSteps.indexOf(i)];
                }
            }
            else { // last step in pathway
                if (concentrations[i - 1] > concentrations[i]) { // flows down
                    concentrations[i - 1] -= .01 * factors[factorSteps.indexOf(i)];
                    concentrations[i] += .01 * factors[factorSteps.indexOf(i)];
                    concentrations[i] -= .01; // always substract constant value from end
                }
            }
        }
        else {
            if (i === 0) { // infinite first substrate
                concentrations[i] = concentrations[i] + .01;
            }
            else if (i < concentrations.length - 1) { // all must last substrate
                if (concentrations[i - 1] > concentrations[i]) { // flows down
                    concentrations[i - 1] = concentrations[i - 1] - .01;
                    concentrations[i] = concentrations[i] + .01;
                }
                else if (reversibleSteps.includes(i)) { // reversible step
                    concentrations[i] -= .01;
                    concentrations[i - 1] += .01;
                }
            }
            else { // last substrate subtract so it doesnt get infinitely bigger
                concentrations[i] = concentrations[i] - .01;
            }
        }
    }
    return concentrations;
}


// Build a flow model from pathway json
export function buildFlow(pathway) {
    // these are mocked for testing fix later
    // const nodesJson = nodes
    if(typeof pathway === "undefined" || typeof pathway.enzymes === "undefined") { 
        console.log("buildFlow: Invalid pathway passed");
        return;
    }

    const nodesJson = generateNodes(pathway);


    var initialNodes = [];
    var initialEdges = [];

    var edgeId = 1;

    var substrates = [];
    var enzymes = [];

    for (let i = 0; i < nodesJson.length; i++) {
        if (nodesJson[i].className === 'substrate') {
            substrates.push(nodesJson[i])
        }
        else {
            enzymes.push(nodesJson[i]);
        }
        initialNodes.push(nodesJson[i]);
    }
    // generate edges for enzymes
    for (let i = 0; i < enzymes.length; i++) {
        var substrateList = enzymes[i].data.substrates;
        var productList = enzymes[i].data.products;
        for (const name of substrateList) {
            for (const substrate of nodesJson) {
                if (substrate.data.title === name) {
                    initialEdges.push({id: String(edgeId), data: substrate.data.title, animated: true, source: substrate.id, target: enzymes[i].id});
                    edgeId++; // update edgeId for next iteration
                    if (enzymes[i].data.reversible === true) { // added data: substrate.data.title
                        initialEdges.push({id: String(edgeId), data: substrate.data.title, animated: true, source: enzymes[i].id, target: substrate.id});
                        edgeId++;
                    }
                }
            }
        }
        for (const name of productList) {
            for (const product of nodesJson) {
                if (product.data.title === name) {
                    initialEdges.push({id: String(edgeId), data: product.data.title, animated: true, source: enzymes[i].id, target: product.id});
                    edgeId++; // update edgeId for next iteration
                }
            }
        }
    }

    // MAKING CHANGE TO DICTIONARY LIKE THIS TO HELP READBILITY
    return {"nodes": initialNodes, "edges": initialEdges};
}

/*
    Function to parse the pathway JSON into reactflow node JSON

    pathwayData is the JSON that will be passed in from the API
*/
export function generateNodes (pathway) {
    if(typeof pathway === "undefined" || typeof pathway.enzymes === "undefined") { 
        console.log("generateNodes: Invalid pathway passed");
        return;
    }

    var nodes = []
    let newNode = null;

    for (let i = 0; i < pathway.enzymes.length; i++) {
        newNode = {
            id: String(i), 
            className: 'enzyme', 
            data: {
                label: pathway.enzymes[i].name, 
                reversible: pathway.enzymes[i].reversible,
                substrates: pathway.enzymes[i].substrates, 
                products: pathway.enzymes[i].products
            },
            position: {x: pathway.enzymes[i].x, y: pathway.enzymes[i].y}
        }
        nodes.push(newNode);
    }
    
    for (let i = 0; i < pathway.molecules.length; i++) {
        newNode = {
            id: String(i + pathway.enzymes.length), 
            className: 'substrate', 
            data: {
                label: pathway.molecules[i].name, 
                title: pathway.molecules[i].name,
                concentration: 100
            },
            position: {x: pathway.molecules[i].x, y: pathway.molecules[i].y}
        }
        nodes.push(newNode);
    }

    return nodes;
}

/*
    This function is used to parse through the pathway JSON.
    It loops through each enzyme and if there are cofactors it adds
    the cofactor name to a list that is returned
*/
export function findSliders(pathwayData) {
    var sliders = []; // list of cofactors extracted from pathway JSON
    var percent = []; // new

    for (let i = 0; i < pathwayData.enzymes.length; i++) {
        if (pathwayData.enzymes[i].cofactors.length > 0) { // if cofactor exists
            for (const cofactor of pathwayData.enzymes[i].cofactors) { // add each cofactor
                if (!sliders.includes(cofactor)) { // only add unique cofactors
                    sliders.push(cofactor);
                    percent.push(1); // new
                }
                else {
                    console.log(cofactor + " already exists in slider list");
                }
            }
        }
    }
    
    return {
        "sliders": sliders,
        "percent": percent
    };
}


/*
    Function to generate the molecules that will be tracked in a pathway
    returns the list of molecules and their corresponding concentrations
    All molecules start with the same baseConcentration

    pathwayData is the JSON passed in
    baseConcentration is a value that will set the base concentration 
        for each molecule (optional) 100 is default
*/
export function findMolecules(pathwayData, baseConcentration=10) {
    var molecules = [];
    var concentrations = [];

    for (let i = 0; i < pathwayData.molecules.length; i++) {
        // probably need to add some error checking like a molecule without name
        // might need to switch to id instead of name depending on how we do JSON
        molecules.push(pathwayData.molecules[i].name);
        concentrations.push(baseConcentration);
    }

    return {
        "molecules": molecules, 
        "concentrations": concentrations
    };
}