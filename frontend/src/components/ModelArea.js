import { Component } from 'react';

import React, {useCallback, useEffect, useState} from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow'

import { run, buildFlow, findMolecules, findSliders } from './utils/pathwayComponentUtils';
// import { nodes as initialNodes, edges as initialEdges } from './initial-elements';
import { getPathwayById } from '../requestLib/requests';
import 'reactflow/dist/style.css';
import './css/ReactFlowArea.css';
import './css/ModelArea.css'

const FlowModel = (props) => {
  const initialNodes = [];
  const initialEdges = [];

  let [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  let [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [userInteractionList, setUserInteractionList] = useState(props.dataObserver)

  let [titles, setTitles] = useState([]);
  let [concentrations, setConcentrations] = useState([]);

  let [factorTitle, setFactorTitle] = useState([]);
  let [factors, setFactors] = useState([]); // represents the percent value from sliders
  let [factorSteps, setFactorSteps] = useState([0])
  let [reversibleSteps, setReversibleSteps] = useState([0])
  let [stopSteps, setStopSteps] = useState([0])

  const [edgeName, setEdgeName] = useState(100);

  const [recievedElements, setRecievedElements] = useState();

  // ------------------------------------------------------------------------
  //  onUserInput functions
  // ------------------------------------------------------------------------
  const handlePathwayLoad = (newPathwayJson) => {
    // TODO: build checks for correct JSON 
    //  should be able to pass in empty JSON to "exit" 
    //  if any component below is missing exit and say something is missing

    try {
      let nodesAndEdgesDict = buildFlow(newPathwayJson);
      setNodes(nodesAndEdgesDict["nodes"]);
      setEdges(nodesAndEdgesDict["edges"]);

      const findMoleculesRes = findMolecules(newPathwayJson);
      setTitles(findMoleculesRes["molecules"]);
      console.log("handle Load titles: " + findMoleculesRes["molecules"]);
      setConcentrations(findMoleculesRes["concentrations"]); 
      
      const findSlidersRes = findSliders(newPathwayJson);
      setFactorTitle(findSlidersRes["sliders"]);
      setFactors(findSlidersRes["percent"]);
    }
    catch(error) {
      console.log("invalid pathway passed")
    }
  }

  // const handlePathwayClose = (newPathwayJson) => {
  //   console.log("pathway close called");
  //   setNodes([]);
  //   setEdges([]);
  //   setTitles([]);
  //   setFactorTitle([]);
  //   setFactors([]);
  // }
  
  /* Function to change the concentration from an adjustment from a slider
      TODO: Change to handle dynamic titles based on what is received from api
      currently hard coded pretty hard but works
  */
  const handleConcChange = (changesJson) => { 
    console.log("handleConc change " + changesJson)
    let changesObj = JSON.parse(changesJson);
    let title = changesObj.title;
    let concentration = changesObj.concentration;

    if(concentration) console.log("concentrations:" + concentration)
    if(titles) console.log("titles: " + title);

    for (let i = 0; i < concentrations.length; i++) {
      if (titles[i] === title) {
        console.log("titles[i] : titles " + titles[i] + " : " + title)
        var tempConcentrations = concentrations
        var newConcentration = 10 * concentration

        tempConcentrations[i] = newConcentration

        setConcentrations(tempConcentrations);
      }
    }
    // this is for changing cofactor ratio
    for (let i = 0; i < factors.length; i++) {
      if (factorTitle[i] === title) {
        
        var tempPercents = factors;
        var newPercent = 1 * concentration;
        tempPercents[i] = newPercent;

        setFactors(tempPercents);
      }
    }
  }

  const [constructorHasRun, setConstructorHasRun] = useState(false);
  const constructor = () => {
    if(constructorHasRun) return; // block if constructor has already been run
    userInteractionList.subscribe("concentrationChange", handleConcChange);
    userInteractionList.subscribe("loadPathway", handlePathwayLoad);
    // userInteractionList.subscribe("closePathway", handlePathwayClose);

    setConstructorHasRun(true);
  }
  constructor(); // rerun constructor on each render


  const onConnect = useCallback((params) => setEdges((els) => addEdge(params, els)), []);

  useEffect(() => {
    setConcentrations((conc) => 
      concentrations = run(concentrations, reversibleSteps, factors, factorSteps)
    );
    setEdges((eds) =>
      eds.map((edge) => {
        // for loop is needed for edges that have the same input, ex. GH3P
        for (let i = 0; i < concentrations.length; i++) {
            if (edge.data == titles[i]) {
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
  }, [factors[0], factors[1], concentrations[0], setEdges]);

  return ( 
    <div className='ModelArea'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        snapToGrid
        onConnect={onConnect}
        fitView
        attributionPosition="top-right"
      >
        <Controls />
      </ReactFlow>
    </div>
  );
};

class FlowModelPopup extends Component {
  constructor(props) {
    
    this.state = {
      visible: false
    }
  }

  render() {

    return (
      <div>

      </div>
    );
  }
}

export default FlowModel;