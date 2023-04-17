import {useLocation, useNavigate} from 'react-router-dom';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    addEdge,
    useReactFlow,
    Controls
} from 'reactflow';
import { generatePathwayJson } from './utils/pathwayBuilderUtils';
import { postPathway, deletePathway, updatePathway } from '../requestLib/apiRequests';


import './../scss/CustomNodes.scss';
import 'reactflow/dist/style.css';

import { BuilderEnzyme } from './customNodes/BuilderEnzyme.js';
import { BuilderMolecule } from './customNodes/BuilderMolecule.js';
import BuilderSideBar from './BuilderSideBar.js';
import Tooltip from './Tooltip';

const nodeTypes = {
    enzyme: BuilderEnzyme,
    molecule: BuilderMolecule
};

const getNodeId = () => `${+new Date()}`;

const initialNodes = [];
const initialEdges = [];


const FlowBuilder = (props) => {
    const reactFlowWrapper = useRef(null); // needed for drag and drop bounds
    const [isPostShown, setPostShown] = useState(false); // displays additional component on push
    const [newTitle, setNewTitle] = useState(""); // used when save as
    const [pathwayID, setPathwayID] = useState(null); // used if editing existing
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [rfInstance, setRfInstance] = useState(null);
    const [editExisting, setEditExisting] = useState(false);
    const { setViewport, getViewport } = useReactFlow();

    const location = useLocation();


    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
      }, []);
    
      const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          const type = event.dataTransfer.getData('application/reactflow');
    
          // check if the dropped element is valid
          if (type === "undefined") { // if nothing was selected return
            return;
          }
          let newNode = JSON.parse(type);
    
          const position = rfInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top
          });
          newNode.position = position;
    
          setNodes((nds) => nds.concat(newNode));
        },
        [rfInstance]
      );

    // if coming from flowModel, update node internals to match whats needed for flowBuilder
    if(location.state && location.state.initialNodes && editExisting === false) {
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
            currentEdge.animated = false; // change styling to build style
            currentEdge.style = {strokeWidth: 5, stroke: '#0000FF'}; // change styling to build style
            if (currentEdge.id[0] === 'R') {
                setEdges((eds) => eds.filter(edge => (edge.id != currentEdge.id)));
            }
        }
        setEditExisting(true);
    }

    const onConnect = useCallback((params) => {
        params.style = {strokeWidth: 5, stroke: '#0000FF'}; // change styling to build style
        console.log(params)
        setEdges((eds) => addEdge(params, eds));
    });

    useEffect(() => {
    }, [nodes, pathwayID]); // monitor pathwayID for changes

    const onPush = useCallback(() => {
        setPostShown(!isPostShown)
        if (isPostShown) {
            const pathwayObj = generatePathwayJson(nodes, edges, newTitle);
            if (pathwayObj) {
                postPathway(pathwayObj)
                window.location.href = '/';
            }
        }
    });

    const onUpdate = useCallback(() => {

        if (pathwayID) { // checks an id exists before trying to update a pathway
            try {
                const pathwayObj = generatePathwayJson(nodes, edges, location.state.title);
                updatePathway(pathwayID, pathwayObj);
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
                    y: 200
                },
            };
            return newNode;
        }
    }, [setNodes]);

    const onAddEnzyme = useCallback((nodeData) => {
        if (nodeData) {
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
                    y: 200
                },
            };
            return newNode;
        }
    }, [setNodes]);

    const onClear = useCallback(() => {
        setNodes(initialNodes);
        setEdges(initialEdges);
        setPathwayID(null); // no pathway id if current Build is cleared
    }, [setNodes, setViewport])

    const onDelete = useCallback(() => {
        if (pathwayID)
        if (window.confirm("Do you really want to delete this pathway?")) {
            if (pathwayID) {
                try{
                    deletePathway(pathwayID)
                    window.location.href = '/';
                    alert("Pathway deleted")
                } catch(error) {
                    alert(error)
                }
            }
        }
    })


    const onNodeClick = (e, clickedNode) => {
        // uncomment in production
        if (window.confirm("Do you really want to delete this node?")) {
            setNodes((nds) => nds.filter(node => node.id !== clickedNode.id)); // deletes selected node
            setEdges((eds) => eds.filter(edge => (edge.target != clickedNode.id && edge.source != clickedNode.id))) // deletes edges with selected node id
        }
    }

    const handleTitleChange = (e) => {
        setNewTitle(e.target.value);
    }

    return (
        <div className='h-100' ref={reactFlowWrapper} style={{background: "#adb5bd"}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setRfInstance}
                nodeTypes={nodeTypes}
                fitView={true}
                onNodeClick={onNodeClick}
                onDrop={onDrop}
                onDragOver={onDragOver}
                attributionPosition="bottom-left"
            >
                <Controls position='bottom-right'/>
                    <div className='container-fluid d-flex flex-row justify-content-between h-100'>
                        <div className='py-3'>
                            <BuilderSideBar
                                onAddMolecule={onAddMolecule}
                                onAddEnzyme={onAddEnzyme}
                            />
                        </div>
                        <div className="py-3">
                            <div className="btn-group" role='group' style={{zIndex: "6"}}>
                                <Tooltip text="Save as a new Pathway">
                                <button class="btn btn-success mx-1" type="submit" onClick={onPush} data-toggle="tooltip" data-placement="right" title="Tooltip on right">Save As</button>
                                </Tooltip>
                                {isPostShown && <PathwayTitle title={handleTitleChange} submit={onPush}/>}
                                <Tooltip text="Update existing pathway">
                                <button class="btn btn-success mx-1" onClick={onUpdate}>Save</button>
                                </Tooltip>
                                <button class="btn btn-danger mx-1" onClick={onClear}>Clear flow</button>
                                <Tooltip text="Remove pathway from database">
                                <button class="btn btn-danger mx-1" onClick={onDelete}>Delete Pathway</button>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
            </ReactFlow>
        </div>
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
        <FlowBuilder />
    </ReactFlowProvider>
);