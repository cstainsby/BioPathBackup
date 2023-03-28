import {useLocation} from 'react-router-dom'; // testing delete maybe
import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    addEdge,
    useReactFlow,
} from 'reactflow';
import { generatePathwayJson } from './utils/pathwayBuilderUtils';
import { postPathway, deletePathway } from '../requestLib/apiRequests';


import './../scss/CustomNodes.scss';
import 'reactflow/dist/style.css';

import { BuilderEnzyme } from './customNodes/BuilderEnzyme.js';
import { BuilderMolecule } from './customNodes/BuilderMolecule.js';
import BuilderSideBar from './BuilderSideBar.js';

const nodeTypes = {
    enzyme: BuilderEnzyme,
    molecule: BuilderMolecule
};
const flowKey = 'example-flow';

const getNodeId = () => `${+new Date()}`;

const initialNodes = [];
const initialEdges = [];

let numEnzymes = 0;

const FlowBuilder = (props) => {
    // const [reactFlowInstance, setReactFlowInstance] = useState(null); // testing
    const [isPostShown, setPostShown] = useState(false); // displays additional component on push
    const [newTitle, setNewTitle] = useState(""); // maybe use
    const [pathwayID, setPathwayID] = useState(null); // used if editing existing
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [rfInstance, setRfInstance] = useState(null);
    const [editExisting, setEditExisting] = useState(false);
    const { setViewport, getViewport } = useReactFlow();

    const location = useLocation();


    // testing
    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
      }, []);
    
      const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const type = event.dataTransfer.getData('application/reactflow');
    
          // check if the dropped element is valid
          console.log(typeof type, 'undefined', type)
          if (type === "undefined") { // if nothing was selected return
            return;
          }
          let newNode = JSON.parse(type);
    
          const position = rfInstance.project({
            x: event.clientX,// - reactFlowBounds.left,
            y: event.clientY// - reactFlowBounds.top,
          });
          newNode.position = position;
    
          setNodes((nds) => nds.concat(newNode));
        },
        [rfInstance]
      );
      // testing

    if(location.state && location.state.initialNodes && editExisting === false) { // used for transfering from flowmodel to flowbuilder
        let enzymeNodes = [];
        setPathwayID(location.state.id);
        for (let node of location.state.initialNodes) {
            node.className = node.className + " build"
            if (node.className === "enzyme build") {
                // needs to be else if because will enter once changed to MoleculeBuild
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
        console.log(nodes, pathwayID)
    }, [nodes, pathwayID]); // monitor pathwayID for changes

    const onPush = useCallback(() => {
        setPostShown(!isPostShown)
        if (isPostShown) {
            const pathwayObj = generatePathwayJson(nodes, edges, newTitle);
            if (pathwayObj) {
                postPathway(pathwayObj)
            }
        }
    });

    const onUpdate = useCallback(() => {

        if (pathwayID) { // checks an id exists before trying to delete a pathway
            console.log("updating pathway: ", pathwayID)
            try {
                var pathwayObj = null;
                if (nodes.length > 0) { // checking if deleting a pathway
                    pathwayObj = generatePathwayJson(nodes, edges, location.state.title);
                }
                if (pathwayObj) {
                    postPathway(pathwayObj)
                }
                else { // if no nodes they are deleting the pathway
                    const alertMessage = "deleting Pathway: " + location.state.title;
                    alert(alertMessage)
                }
                deletePathway(pathwayID)
            }
            catch(err) {
            }
        }
    });

    const onAddMolecule = useCallback((nodeData) => {
        if (nodeData) {
            const newNode = {
                id: getNodeId(),
                className: 'molecule build',
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
            // setNodes((nds) => nds.concat(newNode));
            return newNode;
        }
    }, [setNodes]);

    const onAddEnzyme = useCallback((nodeData) => {
        if (nodeData) {
            numEnzymes += 1; // used for moving node generation down y axis
            const newNode = {
                id: getNodeId(),
                className: 'enzyme build',
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
            // setNodes((nds) => nds.concat(newNode));
            return newNode;
        }
    }, [setNodes]);

    const onClear = useCallback(() => {
        localStorage.clear();
        setNodes(initialNodes);
        setEdges(initialEdges);
        // setPathwayID(null); // no pathway id if current Build is cleared
    }, [setNodes, setViewport])


    const onNodeClick = (e, clickedNode) => {
        // uncomment in production
        if (window.confirm("Do you really want to delete this node?")) {
            setNodes((nds) => nds.filter(node => node.id !== clickedNode.id)); // deletes selected node
            setEdges((eds) => eds.filter(edge => (edge.target != clickedNode.id && edge.source != clickedNode.id))) // deletes edges with selected node id
        }
        if (clickedNode.type === "enzyme") { // check if an enzyme was deleted
            numEnzymes -= 1;
        }
    }

    const handleTitleChange = (e) => {
        setNewTitle(e.target.value);
    }

    // const test = (e) => {
    //     let view = getViewport();
    //     console.log(e, "test", view)
    // }

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
        onDrop={onDrop} // testing
        onDragOver={onDragOver} // testing
        >
        <div className="save__controls">
            <button class="btn btn-success" type="submit" onClick={onPush}>Save As</button>
            
            {isPostShown && <PathwayTitle title={handleTitleChange} submit={onPush}/>}
            <button class="btn btn-primary" onClick={onUpdate}>Save</button>

            <button class="btn btn-secondary" onClick={onClear}>clear flow</button>
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
    <ReactFlowProvider >
        <FlowBuilder />
    </ReactFlowProvider>
);