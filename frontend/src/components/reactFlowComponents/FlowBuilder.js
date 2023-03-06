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
import '../css/ReactFlowArea.css';


// import ReversibleEnzyme from'../customNodes/ReversibleEnzyme';
import BuilderEnzyme from '../customNodes/BuilderEnzyme';
import Molecule from '../customNodes/Molecule';
import BuilderSideBar from './BuilderSideBar';
import BuilderMolecule from '../customNodes/BuilderMolecule';

const nodeTypes = {
    // reversibleEnzyme: ReversibleEnzyme,
    enzyme: BuilderEnzyme,
    // molecule: Molecule
    molecule: BuilderMolecule
};

const flowKey = 'example-flow';

const getNodeId = () => `${+new Date()}`;

const initialNodes = [];
const initialEdges = [];


const SaveRestore = (props) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [rfInstance, setRfInstance] = useState(null);
    const { setViewport } = useReactFlow();

    // const pathwayObj = {
    //     "name": "BenWorkings",
    //     "author": 1,
    //     "public": false,
    //     "enzyme_instances": [],
    //     "molecule_instances": [],
    //     "cofactor_instances": []
    // }

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
    // const onConnect = useCallback((params) => {
    //     console.log(params, "Params", params.source);
    //     setEdges((eds) => addEdge(params, eds));
    //     console.log(nodes,"nodes")
    //     var currEnzyme = nodes.find(obj => {
    //         console.log(obj)
    //         return obj.id === params.source;
    //     })
    //     console.log(currEnzyme, "currenzyme")
    // }, [setEdges]);

    // useEffect((node) => {

    // }, [nodes, setEdges]);

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
        const pathwayObj = generatePathwayJson(nodes, edges);
        console.log(nodes, "etestign")
        console.log("request", pathwayObj);
        postPathway(pathwayObj)
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
            x: 500,
            y: 450,
        },
        };
        setNodes((nds) => nds.concat(newNode));
    }, [setNodes]);

    const onAddEnzyme = useCallback((nodeData) => {
        const newNode = {
            id: getNodeId(),
            className: 'enzymeBuild',
            // data: { label: nodeData.name, type: "enzyme" },
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
                // x: Math.random() * window.innerWidth - 100,
                // y: Math.random() * window.innerHeight,
                x: 500,
                y: 500,
            },
        };
        setNodes((nds) => nds.concat(newNode));
        console.log("Newnode", nodes)
    }, [setNodes]);

    const onClear = useCallback(() => {
        localStorage.clear();
        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [setNodes, setViewport])

    return (
        <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setRfInstance}
        nodeTypes={nodeTypes}
        >
        <div className="save__controls">
            <button onClick={onSave}>save</button>
            <button onClick={onRestore}>restore</button>
            <button onClick={onPush}>push</button>
            <button onClick={onClear}>clear flow</button>
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

export default () => (
    <ReactFlowProvider>
        <SaveRestore />
    </ReactFlowProvider>
);