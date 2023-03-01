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
    const enzymeInstances = generateEnzymeInstances(enzymes, molecules);
    const cofactorInstances = []

    const pathwayObj = {
        "name": "BenWorkings",
        "author": 1,
        "public": false,
        "enzyme_instances": enzymeInstances,
        "molecule_instances": moleculeInstances,
        "cofactor_instances": cofactorInstances
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
function generateEnzymeInstances(enzymes, molecules) {
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
            var molecule = molecules.find(obj => {
                return obj.data.molecule_id === substrate;
              })
            if (molecule) {
                enzymeObj.substrate_instances.push(parseInt(molecule.id));
            }
        }
        for (const product of enzyme.data.products) {
            molecule = molecules.find(obj => {
                return obj.data.molecule_id === product;
              })
            if (molecule) {
                enzymeObj.product_instances.push(parseInt(molecule.id));
            }
        }
        for (const cofactor of enzyme.data.cofactors) {
            molecule = molecules.find(obj => {
                return obj.data.molecule_id === cofactor;
              })
            if (molecule) {
                enzymeObj.cofactor_instances.push(parseInt(molecule.id));
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