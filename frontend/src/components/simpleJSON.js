const nodes = [
    { id: '1', className: 'enzyme', data: { label: 'Node 1', reversible: false, substrates: ['Glucose', 'ATP'], products: ['G6P', 'ADP'] }, position: { x: 100, y: 300 } },
    { id: '2', className: 'enzyme', data: { label: 'Node 2', reversible: true, substrates: ['G6P'], products: ['Pyruvate'] }, position: { x: 100, y: 700 } },
    // { id: '3', className: 'enzyme', data: { label: 'Node 1', substrates: [], products: [] }, position: { x: 100, y: 100 } },
    { id: '4', className: 'substrate', data: { label: 'Glucose', title: 'Glucose'}, position: { x: 100, y: 100 } },
    { id: '5', className: 'substrate', data: { label: 'G6P', title: 'G6P' }, position: { x: 100, y: 500 } },
    { id: '6', className: 'substrate', data: { label: 'Pyruvate', title: 'Pyruvate' }, position: { x: 100, y: 900 } }
]

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export function buildNodes () {
    var initialNodes = [];
    for (let i = 0; i < nodes.length; i++) {
        initialNodes.push(nodes[i]);
    }
    return initialNodes;
}

export function buildFlow() {
    // these are mocked for testing fix later
    // const nodesJson = nodes
    const nodesJson = generateNodes();

    for (const node of nodesJson) {
        console.log(node.data, node.position);
    }

    var initialNodes = [];
    var initialEdges = [];

    var edgeId = 1;

    var substrates = [];
    var enzymes = [];

    for (let i = 0; i < nodesJson.length; i++) {
        if (nodesJson[i].className == 'substrate') {
            substrates.push(nodesJson[i])
        }
        else {
            enzymes.push(nodesJson[i]);
        }
        initialNodes.push(nodesJson[i]);
    }
    // generate edges for enzymes
    for (let i = 0; i < enzymes.length; i++) {
        console.log("test1");
        var substrateList = enzymes[i].data.substrates;
        var productList = enzymes[i].data.products;
        console.log(substrateList);
        for (const name of substrateList) {
            console.log("test2");
            for (const substrate of nodes) {
                console.log("test3", substrate.data.title, name);
                if (substrate.data.title == name) {
                    console.log("test4");
                    initialEdges.push({id: edgeId, animated: true, source: substrate.id, target: enzymes[i].id});
                    edgeId++; // update edgeId for next iteration
                    if (enzymes[i].data.reversible == true) {
                        console.log("test5");
                        initialEdges.push({id: edgeId, animated: true, source: enzymes[i].id, target: substrate.id});
                        edgeId++;
                    }
                }
            }
        }
        for (const name of productList) {
            for (const product of nodes) {
                if (product.data.title == name) {
                    initialEdges.push({id: edgeId, animated: true, source: enzymes[i].id, target: product.id});
                    edgeId++; // update edgeId for next iteration
                }
            }
        }
    }
    console.log(initialEdges[0]);

    return [initialNodes, initialEdges];
}

/*
    Function to parse the pathway JSON into reactflow node JSON

    pathwayData is the JSON that will be passed in from the API
*/
export function generateNodes (pathway) {
    var nodes = []

    // delete later
    pathway = pathwayJson; // this is mocking the json that will be passed in

    for (let i = 0; i < pathway.enzymes.length; i++) {
        var newNode = {
            id: i, 
            className: 'enzyme', 
            data: {
                label: pathway.enzymes[i].name, 
                reversible: pathway.enzymes[i].reversible,
                substrates: pathway.enzymes[i].substrates, 
                products: pathway.enzymes[i].products
            },
            position: {x: 100, y: (i + 1) * 300}
        }
        nodes.push(newNode);
    }
    
    for (let i = 0; i < pathway.molecules.length; i++) {
        var newNode = {
            id: i + pathway.enzymes.length, 
            className: 'substrate', 
            data: {
                label: pathway.molecules[i].name, 
                title: pathway.molecules[i].name
            },
            position: {x: 100, y: (i + 1) * 200}
        }
        nodes.push(newNode);
    }

    console.log(nodes);
    return nodes;
}

const pathwayJson = {
    "name": "Glycolysis",
    "author": "Admin",
    "link": "https://proteopedia.org/wiki/index.php/Glycolysis",
    "public": true,
    "enzymes": [
        {
            "name": "Hexokinase",
            "image": "path/to/image",
            "link": "https://proteopedia.org/wiki/index.php/Kyle_Schroering_Sandbox",
            "author": "Admin",
            "public": true,
            "reversible": false,
            "x": 0,
            "y": 100,
            "substrates": [
                "Glucose",
                "ATP"
            ],
            "products": [
                "Glucose6P",
                "ADP"
            ],
            "cofactors": ['ATP', 'HCL', 'DCL']
        },
        ],
        "molecules": [
            {
            "name": "Glucose",
            "ball_and_stick_image": "path/to/image",
            "space_filling_image": "path/to/image",
            "link": "https://en.wikipedia.org/wiki/Glucose",
            "author": "Admin",
            "public": true,
            "x": 0,
            "y": 0
            },
            {
            "name": "Glucose6P",
            "ball_and_stick_image": "path/to/image",
            "space_filling_image": "path/to/image",
            "link": "https://en.wikipedia.org/wiki/Glucose_6-phosphate",
            "author": "Admin",
            "public": true,
            "x": 0,
            "y": 200
            }
        ]
    }

/*
    This function is used to parse through the pathway JSON.
    It loops through each enzyme and if there are cofactors it adds
    the cofactor name to a list that is returned
*/
export function findSliders(pathwayData) {
    var sliders = []; // list of cofactors extracted from pathway JSON

    // delete later
    pathwayData = pathwayJson; // this is mocking the json that will be passed in

    for (let i = 0; i < pathwayData.enzymes.length; i++) {
        if (pathwayData.enzymes[i].cofactors.length > 0) { // if cofactor exists
            for (const cofactor of pathwayData.enzymes[i].cofactors) { // add each cofactor
                if (!sliders.includes(cofactor)) { // only add unique cofactors
                    sliders.push(cofactor);
                }
                else {
                    console.log(cofactor + " already exists in slider list");
                }
            }
        }
    }

    return sliders;
}

/*
    Function to generate the molecules that will be tracked in a pathway
    returns the list of molecules and their corresponding concentrations
    All molecules start with the same baseConcentration

    pathwayData is the JSON passed in
    baseConcentration is a value that will set the base concentration 
        for each molecule (optional) 100 is default
*/
export function findMolecules(pathwayData, baseConcentration=100) {
    var molecules = [];
    var concentrations = [];

    // delete later
    pathwayData = pathwayJson; // this is mocking the json that will be passed in

    for (let i = 0; i < pathwayData.molecules.length; i++) {
        // probably need to add some error checking like a molecule without name
        // might need to switch to id instead of name depending on how we do JSON
        molecules.push(pathwayData.molecules[i].name);
        concentrations.push(baseConcentration);
    }

    console.log(molecules, concentrations);

    return [molecules, concentrations];
}