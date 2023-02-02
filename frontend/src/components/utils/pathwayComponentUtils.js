import ReversibleEnzyme from "../customNodes/ReversibleEnzyme";




/**
 Build a flow model from pathway json
*/ 
export function buildFlow(pathway) {
    // these are mocked for testing fix later
    if(typeof pathway === "undefined" || typeof pathway.enzymes === "undefined") { 
        console.log("buildFlow: Invalid pathway passed");
        return;
    }
    // MAKING CHANGE TO DICTIONARY LIKE THIS TO HELP READBILITY
    return {"nodes": generateNodes(pathway), "edges": generateEdges(pathway)};
}

/**
 * Generates ReactFlow edges between enzyme and molecule nodes
 * @param {*} pathway
 */
export function generateEdges(pathway) {
    let edges = [];
    for (const enzyme of pathway.enzymes) {
        // Make edge from substrate to enzyme
        for (const substrate_id of enzyme.substrates) {
            if (enzyme.reversible) {
                edges.push({
                    id: String(substrate_id) + "_" + String(enzyme.id),
                    data: {
                        "title": String(substrate_id) + " to " + String(enzyme.id),
                        "molecule_id": String(substrate_id),
                        "direction": "forward"
                    },
                    animated: true,
                    // type: "straight",
                    source: String(substrate_id) + "_molecule",
                    sourceHandle: "bottom-source",
                    targetHandle: "top-target",
                    target: String(enzyme.id) + "_enzyme"
                });
                edges.push({
                    id: "R_" + String(enzyme.id) + "_" + String(substrate_id),
                    data: {
                        "title": String(substrate_id) + " to " + String(enzyme.id),
                        "molecule_id": String(substrate_id),
                        "direction": "reverse"
                    },
                    animated: true,
                    // type: "straight",
                    source: String(enzyme.id) + "_enzyme",
                    sourceHandle: "top-source",
                    targetHandle: "bottom-target", // this sets which hanlder to connect to
                    target: String(substrate_id) + "_molecule"
                });
            }
            else { // not a ReversibleEnzyme only need one edge
                edges.push({
                    id: String(substrate_id) + "_" + String(enzyme.id),
                    data: {
                        "title": String(substrate_id) + " to " + String(enzyme.id),
                        "molecule_id": String(substrate_id),
                        "direction": "forward"
                    },
                    animated: true,
                    source: String(substrate_id) + "_molecule",
                    sourceHandle: "bottom-source",
                    target: String(enzyme.id) + "_enzyme",
                });
            }
        }
        // Make edge from enzyme to product
        for (const product_id of enzyme.products) {
            if (enzyme.reversible) {
                edges.push({
                    id: String(enzyme.id) + "_" + String(product_id),
                    data: {
                        "title": String(product_id) + " to " + String(enzyme.id),
                        "molecule_id": String(product_id),
                        "direction": "forward"
                    },
                    animated: true,
                    // type: "straight",
                    source: String(enzyme.id) + "_enzyme",
                    sourceHandle: "bottom-source",
                    target: String(product_id) + "_molecule"
                });
                edges.push({
                    id: "R_" + String(enzyme.id) + "_" + String(product_id),
                    data: {
                        "title": String(product_id) + " to " + String(enzyme.id),
                        "molecule_id": String(product_id),
                        "direction": "reverse"
                    },
                    animated: true,
                    // type: "straight",
                    source: String(product_id) + "_molecule",
                    targetHandle: "bottom-target",
                    target: String(enzyme.id) + "_enzyme"
                });
            }
            else {
                edges.push({
                    id: String(enzyme.id) + "_" + String(product_id),
                    data: {
                        "title": String(product_id) + " to " + String(enzyme.id),
                        "molecule_id": String(product_id),
                        "direction": "forward"
                    },
                    animated: true,
                    source: String(enzyme.id) + "_enzyme",
                    target: String(product_id) + "_molecule"
                });
            }
        }
    }
    return edges;
}

/**
    Function to parse the pathway JSON into reactflow nodes

    @param pathway Pathway object retrieved from backend
    @return lists of nodes to be used by ReactFlow
*/
export function generateNodes(pathway) {
    if(typeof pathway === "undefined" || typeof pathway.enzymes === "undefined") { 
        console.log("generateNodes: Invalid pathway passed");
        return;
    }
    let nodes = []

    for (const enzyme of pathway.enzymes) {
        // Reactflow node
        if (enzyme.reversible) { // new for multi handlers
            nodes.push({
                id: String(enzyme.id) + "_enzyme", 
                className: 'enzyme', 
                data: {
                    label: enzyme.name, 
                    type: "enzyme",
                    reversible: enzyme.reversible,
                    substrates: enzyme.substrates, 
                    products: enzyme.products,
                    image: enzyme.link
                },
                type: "reversibleEnzyme",
                position: {x: enzyme.x, y: enzyme.y}
            });   
        }
        else {
            nodes.push({
                id: String(enzyme.id) + "_enzyme", 
                className: 'enzyme', 
                data: {
                    label: enzyme.name, 
                    type: "enzyme",
                    reversible: enzyme.reversible,
                    substrates: enzyme.substrates, 
                    products: enzyme.products
                },
                position: {x: enzyme.x, y: enzyme.y}
            });
        }
    }
    
    for (const molecule of pathway.molecules) {
        // Reactflow node
        nodes.push({
            id: String(molecule.id) + "_molecule", 
            className: 'Molecule', 
            data: {
                label: molecule.name,
                type: "molecule",
                title: molecule.name
            },
            type: "molecule",
            position: {x: molecule.x, y: molecule.y}
        });
    }
    return nodes;
}


/**
 * Parses a list of enzyme data from pathway data
 * @param pathwayData data from backend
 * @returns list of enzymes with substrates, products, and cofactors
 */
export function parseEnzymesForSliders(pathwayData) {
    let enzymes = [];
    for (const enzyme of pathwayData.enzymes) {
        let e = {
            "substrates": [],
            "products": [],
            "cofactors": [],
            "reversible": enzyme.reversible
        }

        // Get abbreviations for molecule IDs
        for (const substrate of enzyme["substrates"]) {
            let m = pathwayData["molecules"].filter(o => {
                return o.id === parseInt(substrate);
            });
            if (m.length > 0) {
                e["substrates"].push({
                    "id": m[0]["id"],
                    "title": m[0]["abbreviation"]
                });
            }
        }
        for (const product of enzyme["products"]) {
            let m = pathwayData["molecules"].filter(o => {
                return o.id === product;
            });
            if (m.length > 0) {
                e["products"].push({
                    "id": m[0]["id"],
                    "title": m[0]["abbreviation"]
                });
            }
        }
        for (const cofactor of enzyme["cofactors"]) {
            let m = pathwayData["molecules"].filter(o => {
                return o.id === cofactor;
            });
            if (m.length > 0) {
                e["cofactors"].push({
                    "id": m[0]["id"],
                    "title": m[0]["abbreviation"]
                });
            }
        }
        enzymes.push(e);
    }
    return enzymes;
}