/**
 * This file holds functions for parsing reactflow nodes into usable JSON for Database
 *  POST requests
 */


/**
 * turns reactflow nodes into correct json for DB POST request
 * 
 * @param {reactflow node} nodes 
 * @param {string} title 
 * @param {int} author 
 * @param {bool} isPublic 
 * @returns JSON Object
 */
export function generatePathwayJson(nodes, edges, title, author, isPublic) {
    const enzymes = nodes.filter(filterEnzymes);
    const molecules = nodes.filter(filterMolecules);
    const moleculeInstances = generateMoleculeInstances(molecules);
    const enzymeInstances = generateEnzymeInstances(enzymes, molecules, edges);
    const cofactorInstances = [] // TODO: add functionality for cofactor instances

    if (!author) { // remove for production
        author = 1;
    }
    if (!isPublic) { // remove for production
        isPublic = false;
    }

    const pathwayObj = {
        "name": title,
        "author": author,
        "public": isPublic,
        "enzyme_instances": enzymeInstances,
        "molecule_instances": moleculeInstances
    }


    console.log(pathwayObj, "pobjk")
    if (!(enzymeInstances.length > 0) || !(moleculeInstances.length > 0)) { // dont push an empty pathway
        alert("Pathway must have an enzyme");
        return null;
    }

    return pathwayObj;
} 


/**
 * creates a list of JSON objects representing
 *  the molecule instances in the pathway
 * 
 * @param {reactflow node} molecules
 */
function generateMoleculeInstances(molecules) {
    let moleculeInstances = [];
    let moleculeObj;
    for (const molecule of molecules) {
        moleculeObj = {
            "temp_id": parseInt(molecule.id),
            "molecule": molecule.data.molecule_id,
            "x": parseInt(molecule.position.x),
            "y": parseInt(molecule.position.y)
        }
        moleculeInstances.push(moleculeObj);
        moleculeObj = {};
    }
    return moleculeInstances;
}

/**
 * creates a list of JSON objects representing
 *  the enzyme instances in the pathway
 * 
 * @param {reactflow node} enzymes
 * @param {reactflow node} molecules
 */
function generateEnzymeInstances(enzymes, molecules, edges) {
    let enzymeInstances = [];
    let enzymeObj;
    for (const enzyme of enzymes) {
        enzymeObj = {
            "enzyme": enzyme.data.enzyme_id,
            "x": parseInt(enzyme.position.x),
            "y": parseInt(enzyme.position.y),
            "limiting": false,
            "substrate_instances": [],
            "product_instances": [],
            "cofactor_instances": []
        }
        for (const substrate of enzyme.data.substrates) {
            var molecule = null;
            var filteredMolecules = molecules.filter(obj => { // filter to molecules of substrate type
                console.log(obj.data.molecule_id, substrate, "testing subs")
                return obj.data.molecule_id === substrate;
            });
            if (filteredMolecules.length > 1) { // multiple of the type
                var filteredEdge = edges.filter(obj => { // find edges to current enzyme
                    return (obj.target === enzyme.id );
                });
                for (const edge of filteredEdge) {
                    for (const mol of filteredMolecules) {
                        if (edge.target === enzyme.id && edge.source === mol.id) {
                            molecule = mol;
                        }
                    }
                }
            }
            else {
                if (filteredMolecules.length === 1) { // a molecule was found
                    molecule = filteredMolecules[0];
                }
            }
            // check if substrate was found in builder
            if (molecule) {
                enzymeObj.substrate_instances.push(parseInt(molecule.id));
            }
            else {
                alert("Enzyme is missing or has an incorrect substrate");
                return null; // stop looping
            }
        }
        for (const product of enzyme.data.products) {
            var molecule = null;
            var filteredMolecules = molecules.filter(obj => {
                return obj.data.molecule_id === product;
            });
            if (filteredMolecules.length > 1) { // only enter if necessary
                var filteredEdge = edges.filter(obj => {
                    return (obj.source === enzyme.id );
                });
                for (const edge of filteredEdge) {
                    for (const mol of filteredMolecules) {
                        if (edge.source === enzyme.id && edge.target === mol.id) {
                            molecule = mol;
                        }
                    }
                }
            }
            else {
                if (filteredMolecules.length === 1) { // a molecule was found
                    molecule = filteredMolecules[0];
                }
            }
            // check if product was found in builder
            if (molecule) {
                enzymeObj.product_instances.push(parseInt(molecule.id));
            }
            else {
                alert("Enzyme is missing or has an incorrect product");
                return null; // stop looping
            }
        }
        console.log(enzyme.data.cofactors, "testst")
        if (enzyme.data.cofactors.length > 0) { // was getting a not iterable error
            for (const cofactor of enzyme.data.cofactors) {
                molecule = molecules.find(obj => {
                    return obj.data.molecule_id === cofactor;
                })
                if (molecule) {
                    enzymeObj.cofactor_instances.push(parseInt(molecule.id));
                }
            }
        }
        enzymeInstances.push(enzymeObj);
        enzymeObj = {};
    }
    return enzymeInstances;
}

/**
 * Filters reactflow nodes and returns nodes with type enzyme
 * 
 * @param {reactFlow Node} node 
 * @returns bool
 */
function filterEnzymes(node) {
    if ( node.data.type === "enzyme") {
        return true;
      }
    return false;
}

/**
 * Filters reactflow nodes and returns nodes with type molecule
 * 
 * @param {reactFlow Node} node 
 * @returns bool
 */
function filterMolecules(node) {
    if ( node.data.type === "molecule") {
        return true;
      }
    return false;
}