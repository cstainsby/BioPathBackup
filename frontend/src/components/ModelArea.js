import { Component } from 'react';
import { useParams } from 'react-router-dom';

import React, {useCallback, useEffect, useState} from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
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

  let [titles, setTitles] = useState([]);
  let [concentrations, setConcentrations] = useState([]);

  let [factorTitles, setFactorTitles] = useState([]);
  let [factorsPercent, setFactorsPercent] = useState([]); // represents the percent value from sliders
  let [factorSteps, setFactorSteps] = useState([0])
  let [reversibleSteps, setReversibleSteps] = useState([0])
  let [stopSteps, setStopSteps] = useState([0])

  const [edgeName, setEdgeName] = useState(100);

  

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

  const handlePathwayOpen = (data) => {
    console.log("handle pathway load: " + JSON.stringify(data))
    setIsPathwayCurrentlyLoaded(true);

    setPathwayTitle(data["name"]);
    setPathwayDescription("about the pathway");
    setPathwayAuthor(data["author"]);

    let nodesAndEdgesDict = buildFlow(data);
    setNodes(nodesAndEdgesDict["nodes"]);
    setEdges(nodesAndEdgesDict["edges"]);

    const findMoleculesRes = findMolecules(data);
    setTitles(findMoleculesRes["molecules"]);
    setConcentrations(findMoleculesRes["concentrations"]); 
    console.log("ON LOAD: concentrations are " + findMoleculesRes["concentrations"])
    
    const findSlidersRes = findSliders(data);
    setFactorTitles(findSlidersRes["sliders"]);
    setFactorsPercent(findSlidersRes["percent"]);

  }

  const handlePathwayClose = () => {
    setIsPathwayCurrentlyLoaded(false);
    setNodes([]);
    setEdges([]);
    setTitles([]);
    setConcentrations([]);
    setFactorTitles([]);
    setFactorsPercent([]);
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
    if(titles) console.log("titles: " + title);

    for (let i = 0; i < concentrations.length; i++) {
      if (titles[i] === title) {
        console.log("titles[i] : titles " + titles[i] + " : " + title)
        var tempConcentrations = concentrations
        var newConcentration = 10 * concentration
        console.log("setting concentration: " + newConcentration)

        tempConcentrations[i] = newConcentration
    
        setConcentrations(tempConcentrations);
        console.log(concentrations)
      }
    }
    // this is for changing cofactor ratio
    for (let i = 0; i < factorsPercent.length; i++) {
      if (factorTitles[i] === title) {
        
        var tempPercents = factorsPercent;
        var newPercent = 1 * concentration;
        tempPercents[i] = newPercent;

        setFactorsPercent(tempPercents);
      }
    }
  }



  const onConnect = useCallback((params) => setEdges((els) => addEdge(params, els)), []);

  useEffect(() => {
    setConcentrations((newConcentration) => {
      const adjustedConcentrations = run(newConcentration, reversibleSteps, factorsPercent, factorSteps);
      console.log("new adjusted concentrations: " + adjustedConcentrations);

      return adjustedConcentrations;
    });
  }, [concentrations])

  useEffect(() => {
    setEdges((eds) =>
      eds.map((edge) => {
        console.log("SETTING EDGES")
        // for loop is needed for edges that have the same input, ex. GH3P
        for (let i = 0; i < concentrations.length; i++) {
            if (edge.data === titles[i]) {
              // edge.style = {strokeWidth: props.concentration[i], stroke: 'red'};
              if (factorSteps.includes(i)) { // is a factor step
                edge.style = {strokeWidth: concentrations[i], stroke: 'yellow'};
              }
              else {
                edge.style = {strokeWidth: concentrations[i], stroke: 'red'};
              }
            }
        }

        return edge;
      })
    );
  }, [factorsPercent[0], factorsPercent[1], setEdges]);

  return ( 
    <div className='ModelArea'>
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
                                                   titles={ factorTitles }
                                                   initialConcs={ factorsPercent }
                                                   handleConcentrationChange={ handleConcChange } />}
      </ReactFlow>
    </div>
  );
};

const PathwayTitleCard = (props) => {
  // props that should be passed in:
  //  pathwayTitle: string 
  //  pathwayDescription: string
  //  pathwayAuthor: string
  //  additionalImage: png img to display (optional)

  return (
    <div id="PathwayTitleCard" className='ModelAreaChild'>
      { (props.pathwayTitle !== "") && (
        <div className="card mb-3" >
          <div class="row g-0">
            { props.additionalImage && 
              <div class="col-md-4">
                <img src={ props.additionalImage } height="120" width="120" className="img-fluid rounded-start"/>
              </div>
            }
            <div className="col-md-8">
              <div className="card-body" id='PathwayTitleTextBox'>
                <h4 className='card-title' id='PathwayTitle'>{ props.pathwayTitle }</h4>
                <p className="card-text">{ props.pathwayDescription }</p>
                <p className="card-text"><small class="text-muted">Created By { props.pathwayAuthor }</small></p>
                {/* <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FlowModel;