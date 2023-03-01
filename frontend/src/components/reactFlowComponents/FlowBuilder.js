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


import ReversibleEnzyme from'../customNodes/ReversibleEnzyme';
import Molecule from '../customNodes/Molecule';
import BuilderSideBar from './BuilderSideBar';

const nodeTypes = {
    reversibleEnzyme: ReversibleEnzyme,
    molecule: Molecule
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

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    useEffect(() => {
    }, [props.concentration, setEdges]);

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
        console.log("request", pathwayObj);
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
            x: Math.random() * window.innerWidth - 100,
            y: Math.random() * window.innerHeight,
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
            type: "reversibleEnzyme",
            position: {
                x: Math.random() * window.innerWidth - 100,
                y: Math.random() * window.innerHeight,
            },
        };
        console.log("Newnode", newNode)
        setNodes((nds) => nds.concat(newNode));
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