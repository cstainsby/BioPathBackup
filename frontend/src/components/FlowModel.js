import { useParams } from 'react-router-dom';
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
import { buildFlow, parseEnzymesForManager } from './utils/pathwayComponentUtils';
import { getPathwayById } from '../requestLib/requests';

import 'reactflow/dist/style.css';
import './css/ReactFlowArea.css';
import './css/ModelArea.css'
import './css/RightSideBarArea.css';

import boogyImg from "../images/boogy.PNG"


import ReversibleEnzyme from'./customNodes/ReversibleEnzyme'
import Molecule from './customNodes/Molecule';
const nodeTypes = {
    reversibleEnzyme: ReversibleEnzyme,
    molecule: Molecule
};

/**
 * Wrapper for ReactFlow and concentration sliders. Main 
 * interaction area for the app.
 * @param props 
 */
const FlowModel = (props) => {

    let [isPathwayCurrentlyLoaded, setIsPathwayCurrentlyLoaded] = useState(false);
    let [pathwayTitle, setPathwayTitle] = useState("");
    let [pathwayDescription, setPathwayDescription] = useState("");
    let [pathwayAuthor, setPathwayAuthor] = useState("");

	let [nodes, setNodes, onNodesChange] = useNodesState([]);
	let [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // molecules[id] = {"title": "ATP", "value": 10}
    let [molecules, setMolecules] = useState([]);

    /**
     * This clgs id and position of ReactFlow nodes onNodeChange
     * @function
     */ 
    // const printNodesOnChange = () => {
    //     let out = []
    //     for (const node of nodes) {
    //         out.push({
    //             id: node.data.label,
    //             pos: node.position
    //         })
    //     }
    //     console.log(out);
    // }

    let { pathwayID } = useParams(); // import params from router
    /**
     * Gets updated pathway based on current FlowModel pathwayID.
     * If there is no pathway ID, close the current pathway.
     */
    useEffect(() => {
        if(pathwayID) {
            console.log("Got pathway:" + pathwayID);
            // get JSON data for pathways
            // including function here will force the modal to re-render
            getPathwayById(pathwayID)
                .then(data => {
                    handlePathwayOpen(data);
                })
                .catch(error => {
                    console.error("Error in FlowModel.getUpdatedPathways", error);
                });
        }
        else {
            handlePathwayClose();
        }
    }, [pathwayID]); // monitor pathwayID for changes

    /**
     * Initializes the model given a newPathway
     * @param newPathway
     */
    const handlePathwayOpen = (newPathway) => {
        //console.log("handle pathway load: " + JSON.stringify(newPathway))
        setIsPathwayCurrentlyLoaded(true);

        setPathwayTitle(newPathway["name"]);
        setPathwayDescription("about the pathway");
        setPathwayAuthor(newPathway["author"]);

        // Create the nodes and edges for ReactFlow
        let nodesAndEdgesDict = buildFlow(newPathway);
        setNodes(nodesAndEdgesDict["nodes"]);
        setEdges(nodesAndEdgesDict["edges"]);

        const enzymesForSliders = parseEnzymesForManager(newPathway);
        props.concentrationManager.addListener((moleculeConcentrations) => {
            let mList = [];
            for (const [id, data] of Object.entries(moleculeConcentrations)) {
                mList[id] = {
                    "title": data.title,
                    "value": data.value
                };
            }
            setMolecules(mList);
            mList = [];
            for (let [id, data] of Object.entries(props.concentrationManager.moleculeDeltas)) {
                mList[id] = {
                    "title": data.title,
                    "forwardValue": data.forwardValue,
                    "reverseValue": data.reverseValue
                };
            }
            setEdges((edges) =>
                edges.map((edge) => {
                    if (props.concentrationManager.enzymes[edge.data.enzyme_id]) {
                        if (edge.id.split("_")[0] === "R") {
                            edge.style = {strokeWidth: props.concentrationManager.enzymes[edge.data.enzyme_id].prodToSub * 500, stroke: 'red'};
                        } else {
                            edge.style = {strokeWidth: props.concentrationManager.enzymes[edge.data.enzyme_id].subToProd * 500, stroke: 'green'};
                        }
                    }
                    return edge;
                })
            );
        });
        props.concentrationManager.parseEnzymes(enzymesForSliders);
    }

    const handleConcentrationChange = (id, value) => {
        props.concentrationManager.setConcentration(id, value);
    }

    /**
     * Cleans up the model
     * @function
     */
    const handlePathwayClose = () => {
        setIsPathwayCurrentlyLoaded(false);
        setNodes([]);
        setEdges([]);
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
    function resetConcentrations() {
        props.concentrationManager.reset();
    }

    return (
        <div className='ModelArea'>
            { !isPathwayCurrentlyLoaded && <h1>Click File&gt;Open to load a pathway!</h1>}
            <ReactFlow className='ModelAreaChild ReactFlow'
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                snapToGrid
                onConnect={onConnect}
                nodeTypes={nodeTypes} // new needed for multiple handlers
                fitView={true}
                attributionPosition="top-right"
            >
            <Controls position='bottom-right' />
            { isPathwayCurrentlyLoaded &&
                <PathwayTitleCard
                    pathwayTitle={ pathwayTitle }
                    pathwayDescription={ pathwayDescription }
                    pathwayAuthor={ pathwayAuthor }
                    additionalImage={ boogyImg }
                /> }
            { isPathwayCurrentlyLoaded &&
                <SliderSideBar
                    slidersTitle="Cofactors"
                    slidersDescription="Adjust cofactor concentrations"
                    molecules={molecules}
                    handleConcentrationChange={ handleConcentrationChange }
                    run = {() => {setRunning(true)}}
                    stop = {() => {setRunning(false)}}
                    reset = {() => resetConcentrations()}
                />}
            </ReactFlow>            
        </div>
    );
};

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
                { props.additionalImage && 
                    <img src={ props.additionalImage } alt="stuff here" width="10" height="150" className="card-img-top"/>
                }
                <div className="card-body" id='PathwayTitleTextBox'>
                    <h4 className='card-title' id='PathwayTitle'>{ props.pathwayTitle }</h4>
                    <p className="card-text">{ props.pathwayDescription }</p>
                    <p className="card-text"><small className="text-muted">Created By { props.pathwayAuthor }</small></p>
                </div>
                <div className="card-footer">
                    <small className="text-muted">Last updated 3 mins ago by { props.pathwayAuthor }</small>
                </div>
                </div>
            )}
        </div>
    );
}

export default FlowModel;