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

  const [userInteractionList, setUserInteractionList] = useState(props.dataObserver)

  const findMoleculesRes = findMolecules()
  let [titles, setTitles] = useState(findMoleculesRes["molecules"]);
  let [concentrations, setConcentrations] = useState(findMoleculesRes["concentrations"]);

  let [factorTitle, setFactorTitle] = useState(findSliders()[0])
  let [factors, setFactors] = useState(findSliders()[1]) // represents the percent value from sliders
  let [factorSteps, setFactorSteps] = useState([0])
  let [reversibleSteps, setReversibleSteps] = useState([0])
  let [stopSteps, setStopSteps] = useState([0])

  let [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  let [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // if passed a pathwayJson through props, load it in 
  // if((typeof props.pathwayEdges !== "undefined" && props.pathwayEdges !== null)
  //     && (typeof props.pathwayNodes !== "undefined" && props.pathwayNodes !== null)) {
    
  //   console.log("valid nodes and edges")
  //   console.log("in flow model nodes: " + JSON.stringify(props.pathwayNodes));
  //   console.log("in flow model edges: " + JSON.stringify(props.pathwayEdges));
  //   nodes = props.pathwayNodes;
  //   edges = props.pathwayEdges;
  // }

  const [edgeName, setEdgeName] = useState(100);


  const [recievedElements, setRecievedElements] = useState();

  // useEffect(() => {
  //   setRecievedElements(elements)
  // })

  // ------------------------------------------------------------------------
  //  onUserInput functions
  // ------------------------------------------------------------------------
  const handlePathwayLoad = (newPathwayJson) => {

    let nodesAndEdgesDict = buildFlow(newPathwayJson)

    console.log("in handle nodes: " + JSON.stringify(nodesAndEdgesDict["nodes"]));
    console.log("in handle edges: " + JSON.stringify(nodesAndEdgesDict["edges"]));
    
    setNodes(nodesAndEdgesDict["nodes"]);
    setEdges(nodesAndEdgesDict["edges"]);
  }
  
  /* Function to change the concentration from an adjustment from a slider
      TODO: Change to handle dynamic titles based on what is received from api
      currently hard coded pretty hard but works
  */
  const handleConcChange = (changesJson) => { 
    let changesObj = JSON.parse(changesJson);
    let title = changesObj.title;
    let concentration = changesObj.concentration;

    console.log("handling concentration change: title: " + title + " concentration: " + concentration);

    // this is where the issue is coming from

    for (let i = 0; i < concentrations.length; i++) {
      if (titles[i] === title) {
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

export default FlowModel;