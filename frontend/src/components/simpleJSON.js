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
                    console.log("goodbye");
                    if (enzymes[i].data.reversible == true) {
                        initialEdges.push({id: edgeId, animated: true, source: enzymes[i].id, target: substrate.id});
                        edgeId++;
                        console.log("hello");
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