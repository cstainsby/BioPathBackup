/**
 * This file holds functions for parsing reactflow nodes into usable JSON for Database
 *  POST requests
 */

export function generatePathwayJson(nodes, title, author, isPublic) {
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
 */
function generateMoleculeInstances(molecules) {
    let moleculeInstances = [];
    let moleculeObj;
    for (const molecule of molecules) {
        moleculeObj = {
            // "temp_id": parseInt(molecule.id),
            // "molecule_name": molecule.data.molecule_name,
            // "abbreviation": molecule.data.label, // abbreviation is the label for molecules
            // "ball_and_stick_image": null,
            // "space_filling_image": null,
            // "link": null,
            // "author": 1,
            // "public": true,
            // "x": parseInt(molecule.position.x),
            // "y": parseInt(molecule.position.y),
            // "molecule": molecule.data.molecule_id,

            // trying new stuff
            "temp_id": parseInt(molecule.id),
            "molecule": molecule.data.molecule_id,
            "x": parseInt(molecule.position.x),
            "y": parseInt(molecule.position.y)
        }
        moleculeInstances.push(moleculeObj);
        moleculeObj = {};
    }
    console.log(moleculeInstances, "minstances")
    return moleculeInstances;
}

/**
 * creates a list of JSON objects representing
 *  the enzyme instances in the pathway
 */
function generateEnzymeInstances(enzymes, molecules) {
    let enzymeInstances = [];
    let enzymeObj;
    for (const enzyme of enzymes) {
        console.log(enzyme, "current enzyme")
        enzymeObj = {
            // "id": parseInt(enzyme.id),
            // "name": enzyme.data.label,
            // "abbreviation": enzyme.data.abbreviation, // abbreviation is the label for enzymes
            // "image": null,
            // "reversible": true,
            // "link": null,
            // "author": 1,
            // "public": true,
            // "x": parseInt(enzyme.position.x),
            // "y": parseInt(enzyme.position.y),
            // "limiting": true,
            // "enzyme": enzyme.data.enzyme_id,
            // "substrate_instances": [],
            // "product_instances": [],
            // "cofactor_instances": []

            // trying new
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
            enzymeObj.substrate_instances.push(parseInt(molecule.id));
        }
        for (const product of enzyme.data.products) {
            molecule = molecules.find(obj => {
                return obj.data.molecule_id === product;
              })
            enzymeObj.product_instances.push(parseInt(molecule.id));
        }
        for (const cofactor of enzyme.data.cofactors) {
            molecule = molecules.find(obj => {
                return obj.data.molecule_id === cofactor;
              })
            enzymeObj.cofactor_instances.push(parseInt(molecule.id));
        }
        enzymeInstances.push(enzymeObj);
        enzymeObj = {};
    }
    console.log(enzymeInstances, "einstances")
    return enzymeInstances;
}

function filterEnzymes(node) {
    if ( node.data.type === "enzyme") {
        return true;
      }
    return false;
}

function filterMolecules(node) {
    if ( node.data.type === "molecule") {
        return true;
      }
    return false;
}