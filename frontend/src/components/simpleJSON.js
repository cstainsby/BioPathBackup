const nodes = [
    { id: '1', className: 'enzyme', data: { label: 'Node 1', reversible: false, substrates: ['Glucose', 'ATP'], products: ['G6P', 'ADP'] }, position: { x: 100, y: 300 } },
    { id: '2', className: 'enzyme', data: { label: 'Node 2', reversible: true, substrates: ['G6P'], products: ['Pyruvate'] }, position: { x: 100, y: 700 } },
    // { id: '3', className: 'enzyme', data: { label: 'Node 1', substrates: [], products: [] }, position: { x: 100, y: 100 } },
    { id: '4', className: 'substrate', data: { label: 'Node 2', title: 'Glucose'}, position: { x: 100, y: 100 } },
    { id: '5', className: 'substrate', data: { label: 'Node 1', title: 'G6P' }, position: { x: 100, y: 500 } },
    { id: '6', className: 'substrate', data: { label: 'Node 2', title: 'Pyruvate' }, position: { x: 100, y: 900 } }
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
    var initialNodes = [];
    var initialEdges = [];

    var edgeId = 1;

    var substrates = [];
    var enzymes = [];

    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].className == 'substrate') {
            substrates.push(nodes[i])
        }
        else {
            enzymes.push(nodes[i]);
        }
        initialNodes.push(nodes[i]);
    }
    // generate edges for enzymes
    for (let i = 0; i < enzymes.length; i++) {
        var substrateList = enzymes[i].data.substrates;
        var productList = enzymes[i].data.products;
        for (const name of substrateList) {
            for (const substrate of nodes) {
                if (substrate.data.title == name) {
                    initialEdges.push({id: edgeId, animated: true, source: substrate.id, target: enzymes[i].id});
                    edgeId++; // update edgeId for next iteration
                    if (enzymes[i].data.reversible == true) {
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

    return [initialNodes, initialEdges];
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
            "cofactors": []
        }
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