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
import 'reactflow/dist/style.css';

import ReversibleEnzyme from'./customNodes/ReversibleEnzyme'
import Molecule from './customNodes/Molecule'
const nodeTypes = {
    reversibleEnzyme: ReversibleEnzyme,
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
        //console.log(pathway)
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
            let clicked_id = node.data.source_id;
            setNodes(nodes.map((n) => {
                if (n.data.source_id === clicked_id) {
                    if (n.data.locked) {
                        props.concentrationManager.unlock(n.data.source_id);
                        n.data.locked = false;
                        n.className = "Molecule"
                    } else {
                        props.concentrationManager.lock(n.data.source_id);
                        n.data.locked = true;
                        n.className = "Molecule locked"
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
                        edge.style = {strokeWidth: props.concentrationManager.enzymes[edge.data.enzyme_id].prodToSub * 300, stroke: 'var(--backward-color)'};
                    } else {
                        edge.style = {strokeWidth: props.concentrationManager.enzymes[edge.data.enzyme_id].subToProd * 300, stroke: 'var(--forward-color)'};
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
            // console.log("clearInterval");
        };
    }, [running, speed]);


    /**
     * Resets concentrations to starting values
     * 
     */
    const resetConcentrations = () => {
        props.concentrationManager.reset();
    }

    const handleEdit = () => { // testing delte later maybe
        navigate('/build', {state:{initialNodes:nodes, initialEdges: edges}});
    }

    return (
        <div className='ModelArea'>
            <ReactFlow className='ModelAreaChild ReactFlow'
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                snapToGrid
                onConnect={onConnect}
                nodeTypes={nodeTypes} // new needed for multiple handlers
                fitView={true}
                attributionPosition="bottom-left"
                onNodeClick={onNodeClick}
            >
                <Controls position='bottom-right' />
                <PathwayTitleCard
                    pathwayTitle={ pathwayTitle }
                    pathwayDescription={ pathwayDescription }
                    pathwayAuthor={ pathwayAuthor }
                    editPathway={handleEdit}
                /> 
                <SliderSideBar
                    slidersTitle="Cofactors"
                    slidersDescription="Adjust cofactor concentrations"
                    molecules={molecules}
                    handleConcentrationChange={ handleConcentrationChange }
                    run = {() => {setRunning(true)}}
                    stop = {() => {setRunning(false)}}
                    reset = {resetConcentrations}
                    running = {running}
                />
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
    //  props that should be passed in:
    //  pathwayTitle: string 
    //  pathwayDescription: string
    //  pathwayAuthor: string
    //  additionalImage: png img to display (optional)

    return (
        <div id="PathwayTitleCard" className='ModelAreaChild'>
            { (props.pathwayTitle !== "") && (
                <div className="card" >
                <div className="card-body" id='PathwayTitleTextBox'>
                    <h4 className='card-title' id='PathwayTitle'>{ props.pathwayTitle }</h4>
                    <p className="card-text">{ props.pathwayDescription }</p>
                    <p className="card-text"><small className="text-muted">Created By { props.pathwayAuthor }</small></p>
                </div>
                <div className="card-footer">
                    <small className="text-muted">Last updated 3 mins ago by { props.pathwayAuthor }</small>
                </div>
                <button onClick={props.editPathway}>Edit pathway</button>
                </div>
            )}
        </div>
    );
}

export default FlowModel;