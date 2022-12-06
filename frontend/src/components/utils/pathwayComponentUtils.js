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
    // const initialNodes = nodes
    if(typeof pathway === "undefined" || typeof pathway.enzymes === "undefined") {
        console.log("buildFlow: Invalid pathway passed");
        return;
    }

<<<<<<< HEAD
    const [enzymeNodes, moleculeNodes] = generateNodes(pathway);

    let initialNodes = [];
    let initialEdges = [];

    let edgeId = 1;

    for (const enzyme of enzymeNodes) {
=======
    const [enzymes, moleculeNodes] = generateNodes(pathway);


    let initialNodes = [];
    let initialEdges = [];

    let edgeId = 1;

    for (const enzyme of enzymes) {
>>>>>>> 1be6136382a54297d832b2454f28e99a20794aff
        initialNodes.push(enzyme);
    }
    for (const molecule of moleculeNodes) {
        initialNodes.push(molecule);
    }

<<<<<<< HEAD
    
    for (const enzymeNode of enzymeNodes) {
        for (const moleculeID of enzymeNode.data.substrates) {
            for (const substrate of moleculeNodes) {
                if (substrate.id === String(moleculeID)) {
                    initialEdges.push({
                        id: String(edgeId), 
                        data: substrate.id, 
                        animated: true, 
                        source: substrate.id, 
                        target: enzymeNode.id
                    });
                    edgeId++; // update edgeId for next iteration

                    // Inlcude for Reversible Edges
                    // if (enzymes[i].data.reversible === true) { // added data: substrate.data.title
                    //     initialEdges.push({
                    //         id: String(edgeId),
                    //         data: substrate.id, 
=======
    // generate edges for enzymes
    // for (const enzyme of pathway.enzymes) {
    //     for (const enzymeMolecule of enzyme.substrates) {
    //         for (const moleculeNode of moleculeNodes) {
    //             if (enzymeMolecule === moleculeNode.id) {
    //                 initialEdges.push({
    //                     id: String(edgeId),
    //                     data: moleculeNode.data.title,
    //                     animated: true,
    //                     source: moleculeNode.id,
    //                     target: enzyme.id
    //                 });
    //                 edgeId++; // update edgeId for next iteration
    //             }
    //         }
    //     }
    //     for (const enzymeMolecule of enzyme.products) {
    //         for (const moleculeNode of moleculeNodes) {
    //             if (enzymeMolecule === moleculeNode.id) {
    //                 initialEdges.push({
    //                     id: String(edgeId), 
    //                     data: moleculeNode.data.title, 
    //                     animated: true, 
    //                     source: enzyme.id, 
    //                     target: moleculeNode.id
    //                 });
    //                 edgeId++; // update edgeId for next iteration
    //             }
    //         }
    //     }
    // }

    
    for (let i = 0; i < enzymes.length; i++) {
        var substrateList = enzymes[i].data.substrates;
        var productList = enzymes[i].data.products;
        for (const name of substrateList) {
            for (const substrate of initialNodes) {
                if (substrate.data.label === name) {
                    initialEdges.push({
                        id: String(edgeId), 
                        data: substrate.data.title, 
                        animated: true, 
                        source: substrate.id, 
                        target: enzymes[i].id
                    });
                    edgeId++; // update edgeId for next iteration
                    // if (enzymes[i].data.reversible === true) { // added data: substrate.data.title
                    //     initialEdges.push({
                    //         id: String(edgeId),
                    //         data: substrate.data.title, 
>>>>>>> 1be6136382a54297d832b2454f28e99a20794aff
                    //         animated: true, 
                    //         source: enzymes[i].id, 
                    //         target: substrate.id
                    //     });
                    //     edgeId++;
                    // }
                }
            }
        }
<<<<<<< HEAD
        for (const moleculeID of enzymeNode.data.products) {
            for (const product of moleculeNodes) {
                if (product.id === String(moleculeID)) {
                    initialEdges.push({
                        id: String(edgeId),
                        data: product.id,
                        animated: true, 
                        source: enzymeNode.id, 
=======
        for (const name of productList) {
            for (const product of initialNodes) {
                if (product.data.label === name) {
                    initialEdges.push({
                        id: String(edgeId),
                        data: product.data.title, 
                        animated: true, 
                        source: enzymes[i].id, 
>>>>>>> 1be6136382a54297d832b2454f28e99a20794aff
                        target: product.id});
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

    let enzymes = []
    let molecules = []

    for (const enzyme of pathway.enzymes) {
        enzymes.push({
            id: String(enzyme.id),
            className: 'enzyme',
            data: {
                label: enzyme.name, 
                reversible: enzyme.reversible,
                substrates: enzyme.substrates, 
                products: enzyme.products
            },
            position: {x: enzyme.x, y: enzyme.y}
        });
    }
    for (const molecule of pathway.molecules) {
        molecules.push({
            id: String(molecule.id),
            className: 'substrate',
            data: {
<<<<<<< HEAD
                label: molecule.name,
=======
                label: molecule.id, 
                title: molecule.name,
>>>>>>> 1be6136382a54297d832b2454f28e99a20794aff
                concentration: 100
            },
            position: {x: molecule.x, y: molecule.y}
        })
    }

    return [enzymes, molecules];
}

/*
    This function is used to parse through the pathway JSON.
    It loops through each enzyme and if there are cofactors it adds
    the cofactor name to a list that is returned
*/
export function findSliders(pathwayData) {
    var sliders = []; // list of cofactors extracted from pathway JSON
    var percent = []; // new

    for (const enzyme of pathwayData.enzymes) {
        if (enzyme.cofactors.length > 0) { // if cofactor exists
            for (const cofactor of enzyme.cofactors) { // add each cofactor
                // TODO: Map cofactorID to pathwayData.molecules name
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
    returns the list of molecule IDs and their corresponding concentrations
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
        molecules.push(pathwayData.molecules[i].id);
        concentrations.push(baseConcentration);
    }

    return {
        "molecules": molecules, 
        "concentrations": concentrations
    };
}