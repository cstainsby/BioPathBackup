import { useNavigate } from 'react-router-dom';
import React, {useCallback, useEffect, useState} from 'react'
import ReactFlow, {
	// MiniMap,
	Controls,
	// Background,
	useNodesState,
	useEdgesState,
	addEdge,
} from 'reactflow'
import SliderSideBar  from "./SliderSideBar";
import { generateNodes, generateEdges } from './utils/pathwayComponentUtils';

import './../scss/CustomNodes.scss';
import 'reactflow/dist/style.css';

import {Enzyme} from'./customNodes/Enzyme.js'
import {Molecule} from './customNodes/Molecule.js'
const nodeTypes = {
    enzyme: Enzyme,
    molecule: Molecule
};

/**
 * Wrapper for ReactFlow and concentration sliders. 
 * Main interaction area for working with a pathway.
 * @param props
 * @prop {Object} concentrationManager used to manage changing concentrations
 * @prop {Object} pathway pathway object generated by the backend
 */
const FlowModel = (props) => {
    let { pathway } = props.pathway;

    let [pathwayTitle, setPathwayTitle] = useState(pathway["name"]);
    let [pathwayDescription, setPathwayDescription] = useState("about the pathway");
    let [pathwayAuthor, setPathwayAuthor] = useState("author");
    let [pathwayID, setPathwayID] = useState(pathway.id)

    // Data used for ReactFlow
	let [nodes, setNodes, onNodesChange] = useNodesState([]);
	let [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // molecules[id] = {"title": "ATP", "value": 10}
    let [molecules, setMolecules] = useState([]);

    const navigate = useNavigate(); // testing delte later maybe

    /**
     * Console logs id and position of ReactFlow nodes 
     * when onNodeChange is called
     * @function
     */ 
    const printNodesOnChange = () => {
        let out = []
        for (const node of nodes) {
            out.push({
                id: node.data.label,
                pos: node.position
            })
        }
        console.log(out);
    }
    // useEffect(() => {
    //     printNodesOnChange();
    // }, [nodes])
    
    /**
     * Gets updated pathway based on current FlowModel pathwayID.
     * If there is no pathway ID, close the current pathway.
     */
    useEffect(() => {
        handlePathwayOpen(pathway)
    }, [pathway]); // monitor pathwayID for changes


    /**
     * Initializes the model given a newPathway
     * @param newPathway
     */
    const handlePathwayOpen = (newPathway) => {
        setRunning(false);
        //console.log("handle pathway load: ", newPathway);

        setPathwayTitle(newPathway["name"]);
        setPathwayDescription("about the pathway");
        setPathwayAuthor(newPathway["author"]);

        // Create the nodes and edges for ReactFlow
        setNodes(generateNodes(pathway));
        setEdges(generateEdges(pathway));

        props.concentrationManager.addListener(onConcentrationUpdate);
        props.concentrationManager.parsePathway(newPathway);
    }

    /**
     * 
     * @param {import('react').BaseSyntheticEvent} e event
     * @param {import('reactflow').Node} node 
     */
    const onNodeClick = (e, node) => {
        if (node.type === "molecule") {
            let clicked_id = node.data.molecule_id;
            setNodes(nodes.map((n) => {
                if (n.data.molecule_id === clicked_id) {
                    if (n.data.locked) {
                        props.concentrationManager.unlock(n.data.molecule_id);
                        n.data.locked = false;
                        n.className = "molecule"
                    } else {
                        props.concentrationManager.lock(n.data.molecule_id);
                        n.data.locked = true;
                        n.className = "molecule locked"
                    }
                }
                return n;
            }));
        }
    }

    /**
     * Updates the molecule data in state and ReactFlow edges
     * @param {Object[]} moleculeConcentrations
     */
    const onConcentrationUpdate = (moleculeConcentrations) => {
        let mList = [];
        for (const [id, data] of Object.entries(moleculeConcentrations)) {
            mList[id] = {
                "title": data.title,
                "value": data.value
            };
        }
        
        setMolecules(mList);
        setEdges((edges) =>
            edges.map((edge) => {
                if (props.concentrationManager.enzymes[edge.data.enzyme_id]) {
                    if (edge.id.split("_")[0] === "R") {
                        edge.style = {strokeWidth: props.concentrationManager.enzymes[edge.data.enzyme_id].prodToSub * 300, stroke: '#FF0000'};
                    } else {
                        edge.style = {strokeWidth: props.concentrationManager.enzymes[edge.data.enzyme_id].subToProd * 300, stroke: '#00FF00'};
                    }
                }
                return edge;
            })
        );
    }

    const handleConcentrationChange = (id, value) => {
        props.concentrationManager.setConcentration(id, value);
    }
  
    // Used by ReactFlow whenever an edge is connected between nodes
	const onConnect = useCallback((params) => setEdges((els) => addEdge(params, els)), [setEdges]);
    
    // Updates the concentrations every 1000 milliseconds
    let [running, setRunning] = useState(false);
    let [speed, setSpeed] = useState(1000);
    useEffect(() => {
        const interval = setInterval(() => {
            if (running) {
                props.concentrationManager.updateConcentrations();
            }
        }, speed);
        
        return () => {
            clearInterval(interval);
        };
    }, [running, speed]);


    /**
     * Resets concentrations to starting values
     * 
     */
    const resetConcentrations = () => {
        props.concentrationManager.reset();
    }

    const handleEdit = () => { // sends reactflow state to flowBuilder
        navigate('/build', {state:{
                                initialNodes: nodes, 
                                initialEdges: edges,
                                id: pathwayID,
                                title: pathwayTitle
                            }});
    }

    return (
        <div className='h-100' style={{background: "#adb5bd"}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes} // new needed for multiple handlers
                fitView={true}
                attributionPosition="bottom-left"
                onNodeClick={onNodeClick}
            >
                <Controls position='bottom-right'/>
                {/* TODO: Make the Sidebars become dropdowns with Bootstrap Offcanvas 
                    pop-outs when size < medium (md) */}
                <div className='container-fluid d-flex flex-row justify-content-between h-100'>
                    <div className='py-3'>
                        <SliderSideBar
                            molecules={molecules}
                            handleConcentrationChange={ handleConcentrationChange }
                            run = {() => {setRunning(true)}}
                            stop = {() => {setRunning(false)}}
                            reset = {resetConcentrations}
                            running = {running}
                        />
                    </div>
                    <div className='py-3'>
                        <PathwayTitleCard
                            pathwayTitle={ pathwayTitle }
                            pathwayDescription={ pathwayDescription }
                            pathwayAuthor={ pathwayAuthor }
                            editPathway={handleEdit}
                        /> 
                    </div>
                </div>
            </ReactFlow>            
        </div>
    );
};

/**
 * 
 * @prop {string} pathwayTitle - the name of the pathway
 * @prop {string} pathwayDescription - the description of the pathway
 * @prop {string} pathwayAuthor - the author of the pathway
 * @returns An informational react component for the current pathway
 */
const PathwayTitleCard = (props) => {
    if (props.pathwayTitle !== "") {
        return (
            <div className='card' style={{zIndex: '5'}}>
                <div className='card-body'>
                    <div className='fs-2 card-title' id='PathwayTitle'>{ props.pathwayTitle }</div>
                    <div className='fs-5 card-text'>{ props.pathwayDescription }</div>
                    <div className='fs-5 card-text'><small className="text-muted">Created By { props.pathwayAuthor }</small></div>
                </div>
                <button className='btn btn-primary' onClick={props.editPathway}>Edit pathway</button>
            </div>
        );
    } else {
        return (
            <></>
        )
    }
}

export default FlowModel;