/**
 * This file holds functions for parsing backend Json into usable dictionaries for reactflow
 *  components and other utility files such as ConcentrationManager.js
 */

/**
 * Generates ReactFlow edges between enzyme and molecule nodes
 * 
 * info - edges are generated by making edge objects for each product and substrate connected to an enzyme.
 *      These edges use the ids from the backend to make a source and target depending if the
 *      edge is between a substrate molecule and enzyme or between an enzyme and product molecule
 * 
 * @param {*} pathway
 */
export function generateEdges(pathway) {
    let edges = [];
    for (const enzyme of pathway.enzyme_instances) {
        // Make edge from substrate to enzyme
        let i = 0;
        for (const substrate_id of enzyme.substrate_instances) {
            edges.push({
                id: String(substrate_id) + "_" + String(enzyme.id),
                data: {
                    "title": String(substrate_id) + " to " + String(enzyme.id),
                    "enzyme_id": String(enzyme.id)
                },
                animated: true,
                source: String(substrate_id) + "_molecule",
                sourceHandle: "bottom-source",
                targetHandle: "top-target-" + i.toString(),
                target: String(enzyme.id) + "_enzyme"
            });
            if (enzyme.reversible) {
                edges.push({
                    id: "R_" + String(enzyme.id) + "_" + String(substrate_id),
                    data: {
                        "title": String(substrate_id) + " to " + String(enzyme.id),
                        "enzyme_id": String(enzyme.id)
                    },
                    animated: true,
                    source: String(enzyme.id) + "_enzyme",
                    sourceHandle: "top-source-" + i.toString(),
                    targetHandle: "bottom-target", // this sets which hanlder to connect to
                    target: String(substrate_id) + "_molecule"
                });
            }
            i++;
        }
        // Make edge from enzyme to product
        i = 0;
        for (const product_id of enzyme.product_instances) {
            edges.push({
                id: String(enzyme.id) + "_" + String(product_id),
                data: {
                    "title": String(product_id) + " to " + String(enzyme.id),
                    "enzyme_id": String(enzyme.id)
                },
                animated: true,
                source: String(enzyme.id) + "_enzyme",
                target: String(product_id) + "_molecule",
                sourceHandle: "bottom-source-" + i.toString(),
                targetHandle: "top-target"
            });
            if (enzyme.reversible) {
                edges.push({
                    id: "R_" + String(enzyme.id) + "_" + String(product_id),
                    data: {
                        "title": String(product_id) + " to " + String(enzyme.id),
                        "enzyme_id": String(enzyme.id)
                    },
                    animated: true,
                    source: String(product_id) + "_molecule",
                    target: String(enzyme.id) + "_enzyme",
                    sourceHandle: "top-source",
                    targetHandle: "bottom-target-" + i.toString()
                });
            }
            i++;
        }
    }
    return edges;
}

/**
    Function to parse the pathway JSON into reactflow nodes

    This function loops through each enzyme in the pathway data list, it then makes a node using the id
        value and other reactflow relevant data. 
            Then it loops through each enyme's products and substrates to make molecule nodes for
            each item in the lists. It follows the same approach of using the molecule id value and
            other relevant data for reactflow nodes.

    @param pathway Pathway object retrieved from backend
    @return lists of nodes to be used by ReactFlow
*/
export function generateNodes(pathway) {
    console.log(pathway);
    if(typeof pathway === "undefined" || typeof pathway.enzyme_instances === "undefined") { 
        console.log("generateNodes: Invalid pathway passed");
        return;
    }
    let nodes = []

    for (const enzyme of pathway.enzyme_instances) {
        // console.log(enzyme, "emzyme")
        // Reactflow node
        if (enzyme.reversible) { // new for multi handlers
            nodes.push({
                id: String(enzyme.id) + "_enzyme", 
                className: 'enzyme', 
                data: {
                    abbreviation: enzyme.abbreviation, // testing maybe later
                    label: enzyme.name, 
                    type: "enzyme",
                    reversible: enzyme.reversible,
                    substrates: enzyme.substrate_instances, 
                    products: enzyme.product_instances,
                    cofactors: enzyme.cofactor_instances, // testing maybe delte later
                    enzyme_id: enzyme.enzyme, // testing maybe delete later
                    image: enzyme.link
                },
                type: "enzyme",
                position: {x: enzyme.x, y: enzyme.y}
            });   
        }
        else {
            nodes.push({
                id: String(enzyme.id) + "_enzyme", 
                className: 'enzyme', 
                data: {
                    abbreviation: enzyme.abbreviation, // testing maybe later
                    label: enzyme.name, 
                    type: "enzyme",
                    reversible: enzyme.reversible,
                    substrates: enzyme.substrate_instances, 
                    products: enzyme.product_instances,
                    cofactors: enzyme.cofactor_instances, // testing maybe delte later
                    enzyme_id: enzyme.enzyme, // testing maybe delete later
                    image: enzyme.link
                },
                type: "enzyme",
                position: {x: enzyme.x, y: enzyme.y}
            });
        }
    }
    
    for (const molecule of pathway.molecule_instances) {
        // Reactflow node
        // console.log(molecule, "molecule")
        nodes.push({
            id: String(molecule.id) + "_molecule", 
            className: 'molecule',
            data: {
                label: molecule.abbreviation,
                type: "molecule",
                molecule_name: molecule.molecule_name,
                molecule_id: molecule.molecule
            },
            type: "molecule",
            position: {x: molecule.x, y: molecule.y}
        });
    }
    return nodes;
}