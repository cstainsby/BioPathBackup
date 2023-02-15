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
import { buildFlow, parseEnzymesForManager } from '../utils/pathwayComponentUtils';

import 'reactflow/dist/style.css';
import '../css/ReactFlowArea.css';

import boogyImg from "../../images/boogy.PNG"


import ReversibleEnzyme from'../customNodes/ReversibleEnzyme'
import UserBuildTool from './UserBuildTool';
const nodeTypes = {
    reversibleEnzyme: ReversibleEnzyme,
};

/**
 * Wrapper for ReactFlow and concentration sliders. Main 
 * interaction area for the app.
 * @param props 
 * @prop {Object} concentrationManager
 * @prop {JSON} pathwayJson
 */
const FlowModel = (props) => {

    let { pathway } = props.pathwayJson;

    let [pathwayTitle, setPathwayTitle] = useState(pathway["name"]);
    let [pathwayDescription, setPathwayDescription] = useState("about the pathway");
    let [pathwayAuthor, setPathwayAuthor] = useState("author");

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
            setEdges((edges) =>
                edges.map((edge) => {
                    if (mList[edge.data.molecule_id]) {
                        edge.style = {strokeWidth: mList[edge.data.molecule_id].value * 10, stroke: 'red'};
                    }
                    return edge;
                })
            );
        });
        console.log("enzymes: " + JSON.stringify(enzymesForSliders));
        props.concentrationManager.parseEnzymes(enzymesForSliders);
    }

    const handleConcentrationChange = (id, value) => {
        props.concentrationManager.setConcentration(id, value);
    }

    /**
     * Cleans up the model
     * @function
     */
    // const handlePathwayClose = () => {
    //     setNodes([]);
    //     setEdges([]);
    // }
  
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
                attributionPosition="top-right"
            >
                <Controls position='bottom-right' />
                <PathwayTitleCard
                    pathwayTitle={ pathwayTitle }
                    pathwayDescription={ pathwayDescription }
                    pathwayAuthor={ pathwayAuthor }
                    additionalImage={ boogyImg }
                /> 
                <SliderSideBar
                    slidersTitle="Cofactors"
                    slidersDescription="Adjust cofactor concentrations"
                    molecules={molecules}
                    handleConcentrationChange={ handleConcentrationChange }
                    run = {() => {setRunning(true)}}
                    stop = {() => {setRunning(false)}}
                />
                {/* <UserBuildTool /> */}
                
            </ReactFlow>            
        </div>
    );
};

/**
 * 
 * @prop {string} pathwayTitle - the name of the pathway
 * @prop {string} pathwayDescription - the description of the pathway
 * @prop {string} pathwayAuthor - the author of the pathway
 * @prop {img} additionalImage - an optional image 
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