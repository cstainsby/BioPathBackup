import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    addEdge,
    useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './css/ReactFlowArea.css';

import './css/Restore.css';

import NodeModal from '../modals/NodeModal'
import ReversibleEnzyme from'./customNodes/ReversibleEnzyme'
import Molecule from './customNodes/Molecule';
import BuilderSideBar from './BuilderSideBar'

const nodeTypes = {
    reversibleEnzyme: ReversibleEnzyme,
    molecule: Molecule
};

const flowKey = 'example-flow';

const getNodeId = () => `randomnode_${+new Date()}`;

const initialNodes = [
    { id: '1', data: { label: 'Node 1' }, position: { x: 100, y: 100 } },
    { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 200 } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];


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

    const onAddMolecule = useCallback(() => {    
        const newNode = {
        id: getNodeId(),
        className: 'MoleculeBuild',
        data: { label: 'Added node', type: "molecule" },
        type: "molecule",
        position: {
            x: Math.random() * window.innerWidth - 100,
            y: Math.random() * window.innerHeight,
        },
        };
        setNodes((nds) => nds.concat(newNode));
    }, [setNodes]);

    const onNewMolecule = useCallback((nodeData) => {    
        const newNode = {
        id: getNodeId(),
        className: 'MoleculeBuild',
        data: { label: nodeData.label, type: "molecule" },
        type: "molecule",
        position: {
            x: Math.random() * window.innerWidth - 100,
            y: Math.random() * window.innerHeight,
        },
        };
        setNodes((nds) => nds.concat(newNode));
    }, [setNodes]);

    const onAddEnzyme = useCallback(() => {
        const newNode = {
            id: getNodeId(),
            className: 'enzymeBuild',
            data: { label: 'Added node', type: "enzyme" },
            type: "reversibleEnzyme",
            position: {
                x: Math.random() * window.innerWidth - 100,
                y: Math.random() * window.innerHeight,
            },
        };
        setNodes((nds) => nds.concat(newNode));
    }, [setNodes]);

    const onNewEnzyme = useCallback((nodeData) => {
        // const newNode = {
        // id: getNodeId(),
        // className: 'enzymeBuild',
        // data: { label: 'Added node', type: "enzyme" },
        // type: "reversibleEnzyme",
        // position: {
        //     x: Math.random() * window.innerWidth - 100,
        //     y: Math.random() * window.innerHeight,
        // },
        // };
        const newNode = {
            id: getNodeId(),
            className: 'enzymeBuild',
            data: { 
                label: nodeData.label,
                substrate: [nodeData.substrates],
                products: [nodeData.products],
                reversible: nodeData.reversible,
                type: "enzyme" 
            },
            type: "reversibleEnzyme",
            position: {
                x: Math.random() * window.innerWidth - 100,
                y: Math.random() * window.innerHeight,
            },
        };
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
            <NodeModal onAdd={onAddMolecule} onNew={onNewMolecule} type="node"/>
            <NodeModal onAdd={onAddEnzyme} onNew={onNewEnzyme} type="enzyme"/>
            {/* <button onClick={onAddMolecule}>add molecule</button> */}
            {/* <button onClick={onAddEnzyme}>add enzyme</button> */}
            <button onClick={onClear}>clear flow</button>
        </div>
        <BuilderSideBar
                    slidersTitle="Cofactors"
                    slidersDescription="Adjust cofactor concentrations"
                    onAddMolecule={onAddMolecule}
                    onNewMolecule={onNewMolecule}
                    onAddEnzyme={onAddEnzyme}
                    onNewEnzyme={onNewEnzyme}
                />
        </ReactFlow>
    );
};

export default () => (
    <ReactFlowProvider>
        <SaveRestore />
    </ReactFlowProvider>
);