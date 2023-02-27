/**
 * This file holds functions for parsing reactflow nodes into usable JSON for Database
 *  POST requests
 */

export function generatePathwayJson(nodes, edges) {
    const enzymes = nodes.filter(filterEnzymes);
    const molecules = nodes.filter(filterMolecules);
    const moleculeInstances = generateMoleculeInstances(molecules);
    const enzymeIntances = generateEnzymeInstances(enzymes);
    return 0;
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
            "molecule_name": molecule.data.molecule_name,
            "abbreviation": molecule.data.label, // abbreviation is the label for molecules
            "ball_and_stick_image": null,
            "space_filling_image": null,
            "link": null,
            "author": 1,
            "public": true,
            "x": molecule.position.x,
            "y": molecule.position.y,
            "molecule": molecule.id,
            "pathway": 43
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
function generateEnzymeInstances(enzymes) {

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