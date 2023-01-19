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

import { run, buildFlow, findMolecules, findSliders } from './utils/pathwayComponentUtils';
// import { nodes as initialNodes, edges as initialEdges } from './initial-elements';
import { getPathwayById } from '../requestLib/requests';
import 'reactflow/dist/style.css';
import './css/ReactFlowArea.css';
import './css/ModelArea.css'

import boogyImg from "../images/boogy.PNG"

import './css/RightSideBarArea.css';


const FlowModel = (props) => {

    let [isPathwayCurrentlyLoaded, setIsPathwayCurrentlyLoaded] = useState(false);
    let [pathwayTitle, setPathwayTitle] = useState("");
    let [pathwayDescription, setPathwayDescription] = useState("");
    let [pathwayAuthor, setPathwayAuthor] = useState("");

    const initialNodes = [];
    const initialEdges = [];

	let [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	let [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    let [moleculeIDs, setMoleculeIDs] = useState([]);
    let [moleculeConcentrations, setMoleculeConcentrations] = useState([]);

    let [cofactorTitles, setFactorTitles] = useState([]);
    let [cofactorPercents, setcofactorPercents] = useState([]); // represents the percent value from sliders
    let [cofactorSteps, setcofactorSteps] = useState([0]) // List of molecule IDs to change via sliders
    let [reversibleSteps, setReversibleSteps] = useState([0])
    let [stopSteps, setStopSteps] = useState([0])

    //const [edgeName, setEdgeName] = useState(100);

    // useEffect(() => {
    //     let out = []
    //     for (const node of nodes) {
    //         out.push({
    //             id: node.data.label,
    //             pos: node.position
    //         })
    //     }
    //     console.log(out);
    // }, [nodes])

    let { pathwayId } = useParams(); // import params from router
    useEffect(() => { 
        if(pathwayId) {
        // get JSON data for pathways
        // including function here will force the modal to re-render
        getPathwayById(pathwayId)
            .then(data => {
            handlePathwayOpen(data);
            })
            .catch(error => {
            console.error("Error in getPathways loadModal", error);
            });
        }
        else {
        handlePathwayClose();
        }
    }, [pathwayId]); // monitor pathwayId for changes

    // ------------------------------------------------------------------------
    //  onUserInput helper functions
    // ------------------------------------------------------------------------

    const handlePathwayOpen = (newPathwayJSON) => {
        console.log("handle pathway load: " + JSON.stringify(newPathwayJSON))
        setIsPathwayCurrentlyLoaded(true);

        setPathwayTitle(newPathwayJSON["name"]);
        setPathwayDescription("about the pathway");
        setPathwayAuthor(newPathwayJSON["author"]);

        let nodesAndEdgesDict = buildFlow(newPathwayJSON);
        setNodes(nodesAndEdgesDict["nodes"]);
        setEdges(nodesAndEdgesDict["edges"]);

        const findMoleculesResult = findMolecules(newPathwayJSON);
        setMoleculeIDs(findMoleculesResult["molecules"]);
        setMoleculeConcentrations(findMoleculesResult["concentrations"]); 
        console.log("ON LOAD: concentrations are " + findMoleculesResult["concentrations"])
        
        const findSlidersRes = findSliders(newPathwayJSON);
        setFactorTitles(findSlidersRes["sliders"]);
        setcofactorPercents(findSlidersRes["percent"]);
    }

    const handlePathwayClose = () => {
        setIsPathwayCurrentlyLoaded(false);
        setNodes([]);
        setEdges([]);
        setMoleculeIDs([]);
        setMoleculeConcentrations([]);
        setFactorTitles([]);
        setcofactorPercents([]);
    }
  
    /* Function to change the concentration from an adjustment from a slider
        TODO: Change to handle dynamic titles based on what is received from api
        currently hard coded pretty hard but works
    */
    const handleConcChange = (changesJson) => { 
        console.log("handleConc change " + changesJson)
        let changesObj = changesJson;
        let title = changesObj.cofactorTitle;
        let concentration = changesObj.newConcentration;

        if(concentration) console.log("concentrations:" + concentration)
        if(moleculeIDs) console.log("titles: " + title);

        for (let i = 0; i < moleculeConcentrations.length; i++) {
        if (moleculeIDs[i] === title) {
            console.log("titles[i] : titles " + moleculeIDs[i] + " : " + title)
            let tempConcentrations = moleculeConcentrations
            let newConcentration = 10 * concentration
            console.log("setting concentration: " + newConcentration)

            tempConcentrations[i] = newConcentration
        
            setMoleculeConcentrations(tempConcentrations);
            console.log(moleculeConcentrations)
        }
        }
        // this is for changing cofactor ratio
        for (let i = 0; i < cofactorPercents.length; i++) {
        if (cofactorTitles[i] === title) {
            
            let tempPercents = cofactorPercents;
            let newPercent = 1 * concentration;
            tempPercents[i] = newPercent;

            setcofactorPercents(tempPercents);
        }
        }
    }

	const onConnect = useCallback((params) => setEdges((els) => addEdge(params, els)), []);

    useEffect(() => {
            setMoleculeConcentrations((newConcentration) => {
            const adjustedConcentrations = run(newConcentration, reversibleSteps, cofactorPercents, cofactorSteps);
            console.log("new adjusted concentrations: " + adjustedConcentrations);
            return adjustedConcentrations;
            });
    }, [moleculeConcentrations])

    useEffect(() => {
        setEdges((eds) =>
        eds.map((edge) => {
            console.log("SETTING EDGES")
            // for loop is needed for edges that have the same input, ex. GH3P
            for (let i = 0; i < moleculeConcentrations.length; i++) {
                if (edge.data.molecule_id === String(moleculeIDs[i])) {
                    // edge.style = {strokeWidth: props.concentration[i], stroke: 'red'};
                    if (cofactorSteps.includes(i)) { // is a cofactor step
                        edge.style = {strokeWidth: moleculeConcentrations[i], stroke: 'yellow'};
                    }
                    else {
                        edge.style = {strokeWidth: moleculeConcentrations[i], stroke: 'red'};
                    }
                }
            }

            return edge;
        })
        );
    }, [cofactorPercents[0], cofactorPercents[1], setEdges, moleculeConcentrations]);

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
                fitView
                attributionPosition="top-right"
            >
            <Controls position='bottom-right' />

            { isPathwayCurrentlyLoaded && <PathwayTitleCard pathwayTitle={ pathwayTitle } 
                                                            pathwayDescription={ pathwayDescription }
                                                            pathwayAuthor={ pathwayAuthor }
                                                            additionalImage={ boogyImg } /> }

            { isPathwayCurrentlyLoaded && <SliderSideBar slidersTitle="Cofactors"
                                                        slidersDescription="Adjust cofactor concentrations"
                                                        titles={ cofactorTitles }
                                                        initialConcs={ cofactorPercents }
                                                        handleConcentrationChange={ handleConcChange } />}
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
                    <img src={ props.additionalImage } width="10" height="150" className="card-img-top"/>
                }
                <div className="card-body" id='PathwayTitleTextBox'>
                    <h4 className='card-title' id='PathwayTitle'>{ props.pathwayTitle }</h4>
                    <p className="card-text">{ props.pathwayDescription }</p>
                    <p className="card-text"><small class="text-muted">Created By { props.pathwayAuthor }</small></p>
                </div>
                <div class="card-footer">
                    <small class="text-muted">Last updated 3 mins ago by { props.pathwayAuthor }</small>
                </div>
                </div>
            )}
        </div>
    );
}

export default FlowModel;