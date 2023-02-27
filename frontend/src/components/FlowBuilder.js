import {useLocation} from 'react-router-dom'; // testing delete maybe
import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    addEdge,
    useReactFlow,
} from 'reactflow';
import { generatePathwayJson } from '../utils/pathwayBuilderUtils';
import { postPathway } from '../../requestLib/apiRequests';

import 'reactflow/dist/style.css';


import BuilderEnzyme from '../customNodes/BuilderEnzyme';
import BuilderSideBar from './BuilderSideBar';
import BuilderMolecule from '../customNodes/BuilderMolecule';

const nodeTypes = {
    enzyme: BuilderEnzyme,
    molecule: BuilderMolecule
};

const flowKey = 'example-flow';

const getNodeId = () => `${+new Date()}`;

const initialNodes = [];
const initialEdges = [];

let numEnzymes = 0;

const SaveRestore = (props) => {
    const [isPostShown, setPostShown] = useState(false); // displays additional component on push
    const [newTitle, setNewTitle] = useState(""); // maybe use
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [rfInstance, setRfInstance] = useState(null);
    const [editExisting, setEditExisting] = useState(false);
    const { setViewport } = useReactFlow();

    const location = useLocation();

    if(location.state && location.state.initialNodes && editExisting === false) { // used for transfering from flowmodel to flowbuilder
        let enzymeNodes = [];
        for (let node of location.state.initialNodes) {
            if (node.className === "Molecule") {
                node.className = "MoleculeBuild"
            }
            else if (node.className === "enzyme") {
                // needs to be else if because will enter once changed to MoleculeBuild
                node.className = "enzymeBuild"
                enzymeNodes.push(node)
            }
        }
        // change the subs / prods from instance ids to real ids
        for (const enzyme of enzymeNodes) {
            for (let i = 0; i < enzyme.data.substrates.length; i++) {
                let mol = location.state.initialNodes.find(obj => {
                    // take the temp_id and convert to int to compare to substrate values
                    return parseInt(obj.id.replace(/\D/g,''), "replace") === enzyme.data.substrates[i];
                })
                enzyme.data.substrates[i] = mol.data.molecule_id; // change the enzyme substrate[] to real molecule ids
            }
            for (let i = 0; i < enzyme.data.products.length; i++) {
                let mol = location.state.initialNodes.find(obj => {
                    return parseInt(obj.id.replace(/\D/g,''), "replace") === enzyme.data.products[i];
                })
                enzyme.data.products[i] = mol.data.molecule_id; // change the enzyme substrate[] to real molecule ids
            }
            for (let i = 0; i < enzyme.data.cofactors.length; i++) {
                let mol = location.state.initialNodes.find(obj => {
                    return parseInt(obj.id.replace(/\D/g,''), "replace") === enzyme.data.cofactors[i];
                })
                enzyme.data.cofactors[i] = mol.data.molecule_id; // change the enzyme substrate[] to real molecule ids
            }
        }
        // update initialNodes with updated enzyme nodes
        for (let enzyme of location.state.initialNodes) {
            let updatedEnzyme = enzymeNodes.find(obj => {
                return obj.id === enzyme.id;
            });
            enzyme = updatedEnzyme;
        }
        console.log(location.state.initialNodes, "test")
        setNodes(location.state.initialNodes);
        setEdges(location.state.initialEdges);

        // remove reversible edges for flowbuilder
        for (const currentEdge of location.state.initialEdges) {
            if (currentEdge.id[0] === 'R') {
                setEdges((eds) => eds.filter(edge => (edge.id != currentEdge.id)));
            }
        }
        setEditExisting(true);
    }

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);


    useEffect(() => {
        console.log(nodes, "ben")
    }, [nodes]); // monitor pathwayID for changes

    const onSave = useCallback(() => {
        if (rfInstance) {
            const flow = rfInstance.toObject();
            localStorage.setItem(flowKey, JSON.stringify(flow));
        }
    }, [rfInstance]);

    const onRestore = useCallback(() => {
        const restoreFlow = async () => {
        const flow = JSON.parse(localStorage.getItem(flowKey));

            if (flow) {
                const { x = 0, y = 0, zoom = 1 } = flow.viewport;
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
                setViewport({ x, y, zoom });
            }
        };

        restoreFlow();
    }, [setNodes, setViewport]);

    const onPush = useCallback(() => {
        setPostShown(!isPostShown);

        if (isPostShown) {
            const pathwayObj = generatePathwayJson(nodes, edges, newTitle);
            // if (pathwayObj) {
                postPathway(pathwayObj)
            // }
        }
    });

    const onAddMolecule = useCallback((nodeData) => {
        const newNode = {
        id: getNodeId(),
        className: 'MoleculeBuild',
        data: { 
            label: nodeData.abbreviation,
            molecule_name: nodeData.name, 
            molecule_id: nodeData.id,
            type: "molecule" },
        type: "molecule",
        position: {
            x: 270 + (Math.random() * 300),
            y: (200 * numEnzymes),
        },
        };
        setNodes((nds) => nds.concat(newNode));
    }, [setNodes]);

    const onAddEnzyme = useCallback((nodeData) => {
        numEnzymes += 1; // used for moving node generation down y axis
        const newNode = {
            id: getNodeId(),
            className: 'enzymeBuild',
            data: {
                label: nodeData.name, 
                abbreviation: nodeData.abbreviation,
                enzyme_id: nodeData.id,
                type: "enzyme",
                reversible: nodeData.reversible,
                substrates: nodeData.substrates, 
                products: nodeData.products,
                cofactors: nodeData.cofactors,
                image: nodeData.link
            },
            type: "enzyme",
            position: {
                x: 800,
                y: (200 * numEnzymes)
            },
        };
        console.log(newNode.data.cofactors, "newNode")
        setNodes((nds) => nds.concat(newNode));
    }, [setNodes]);

    const onClear = useCallback(() => {
        localStorage.clear();
        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [setNodes, setViewport])


    const onNodeClick = (e, clickedNode) => {
        // uncomment in production
        //if (window.confirm("Do you really want to delete this node?")) {
            setNodes((nds) => nds.filter(node => node.id !== clickedNode.id)); // deletes selected node
            setEdges((eds) => eds.filter(edge => (edge.target != clickedNode.id && edge.source != clickedNode.id))) // deletes edges with selected node id
        //}
        if (clickedNode.type === "enzyme") { // check if an enzyme was deleted
            numEnzymes -= 1;
        }
    }

    const handleTitleChange = (e) => {
        setNewTitle(e.target.value);
    }

    return (
        <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setRfInstance}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        >
        <div className="save__controls">
            <button class="btn btn-primary" onClick={onSave}>save</button>
            <button class="btn btn-warning" onClick={onRestore}>restore</button>
            {/* <button onClick={onPush}>push</button> */}

            
                <button class="btn btn-success" type="submit" onClick={onPush}>push</button>
            
            {isPostShown && <PathwayTitle title={handleTitleChange} submit={onPush}/>}

            <button class="btn btn-danger" onClick={onClear}>clear flow</button>
        </div>
        <BuilderSideBar
                    slidersTitle="Pathway Builder"
                    slidersDescription="Create a new Pathway"
                    onAddMolecule={onAddMolecule}
                    onAddEnzyme={onAddEnzyme}
                />
        </ReactFlow>
    );
};

const PathwayTitle = (props) => { // take user input to set pathway title

    return(
        <div>
            <label>Enter Pathway title: </label>
            <input type="text" onChange={(e) => props.title(e)}></input>
            <button onClick={props.submit}>Submit</button>
        </div>
    )
}

export default () => (
    <ReactFlowProvider>
        <SaveRestore />
    </ReactFlowProvider>
);