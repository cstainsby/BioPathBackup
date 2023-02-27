/**
 * This file holds functions for parsing reactflow nodes into usable JSON for Database
 *  POST requests
 */

export function generatePathwayJson(nodes, edges) {
    const enzymes = nodes.filter(filterEnzymes);
    const molecules = nodes.filter(filterMolecules);
    const moleculeInstances = generateMoleculeInstances(molecules);
    const enzymeInstances = generateEnzymeInstances(enzymes, molecules);

    // const moleculeInstances = [
    //     {
    //         "id": 573,
    //         "molecule_name": "molecule1",
    //         "abbreviation": "m1",
    //         "ball_and_stick_image": null,
    //         "space_filling_image": null,
    //         "link": null,
    //         "author": 1,
    //         "public": true,
    //         "x": 45,
    //         "y": 0,
    //         "molecule": 467,
    //         "pathway": 45
    //     },
    //     {
    //         "id": 574,
    //         "molecule_name": "molecule2",
    //         "abbreviation": "m2",
    //         "ball_and_stick_image": null,
    //         "space_filling_image": null,
    //         "link": null,
    //         "author": 1,
    //         "public": true,
    //         "x": 45,
    //         "y": 240,
    //         "molecule": 468,
    //         "pathway": 45
    //     },
    //     {
    //         "id": 575,
    //         "molecule_name": "molecule3",
    //         "abbreviation": "m3",
    //         "ball_and_stick_image": null,
    //         "space_filling_image": null,
    //         "link": null,
    //         "author": 1,
    //         "public": true,
    //         "x": 195,
    //         "y": 120,
    //         "molecule": 469,
    //         "pathway": 45
    //     }
    // ];
    // const enzymeInstances = [
    //     {
    //         "id": 243,
    //         "name": "enzyme1",
    //         "abbreviation": "e1",
    //         "image": null,
    //         "reversible": true,
    //         "link": null,
    //         "author": 1,
    //         "public": true,
    //         "x": 0,
    //         "y": 100,
    //         "limiting": true,
    //         "enzyme": 279,
    //         "pathway": 45,
    //         "substrate_instances": [
    //             573
    //         ],
    //         "product_instances": [
    //             574
    //         ],
    //         "cofactor_instances": [
    //             575
    //         ]
    //     }
    // ];

    const pathwayObj = {
        "id": 40,
        "enzyme_instances": enzymeInstances,
        "moleculeInstances": moleculeInstances,
        "name": "testInsert",
        "link": null,
        "public": true,
        "author": 1
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
            "id": parseInt(molecule.id),
            "molecule_name": molecule.data.molecule_name,
            "abbreviation": molecule.data.label, // abbreviation is the label for molecules
            "ball_and_stick_image": null,
            "space_filling_image": null,
            "link": null,
            "author": 1,
            "public": true,
            "x": parseInt(molecule.position.x),
            "y": parseInt(molecule.position.y),
            "molecule": molecule.data.molecule_id,
            "pathway": 40
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
            "id": parseInt(enzyme.id),
            "name": enzyme.data.label,
            "abbreviation": enzyme.data.abbreviation, // abbreviation is the label for enzymes
            "image": null,
            "reversible": true,
            "link": null,
            "author": 1,
            "public": true,
            "x": parseInt(enzyme.position.x),
            "y": parseInt(enzyme.position.y),
            "limiting": true,
            "enzyme": enzyme.data.enzyme_id,
            "pathway": 40,
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