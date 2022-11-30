import React, {useCallback, useEffect, useState} from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow'

import { run, buildFlow } from './utils/pathwayComponentUtils';
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
  var [concentrations, setConcentrations] = useState(props.concentration);

  // if passed a pathwayJson through props, load it in 
  if((typeof props.pathwayEdges !== "undefined" && props.pathwayEdges !== null)
      && (typeof props.pathwayNodes !== "undefined" && props.pathwayNodes !== null)) {
    
    console.log("valid nodes and edges")
    console.log("in flow model nodes: " + JSON.stringify(props.pathwayNodes));
    console.log("in flow model edges: " + JSON.stringify(props.pathwayEdges));
    nodes = props.pathwayNodes;
    edges = props.pathwayEdges;
  }

  const [edgeName, setEdgeName] = useState(100);


  const [recievedElements, setRecievedElements] = useState();

  // useEffect(() => {
  //   setRecievedElements(elements)
  // })
  

  const onConnect = useCallback((params) => setEdges((els) => addEdge(params, els)), []);

  useEffect(() => {
    setConcentrations((conc) => 
      concentrations = run(props.concentration, props.reversibleSteps, props.factors, props.factorSteps)
    );
    setEdges((eds) =>
      eds.map((edge) => {
        // for loop is needed for edges that have the same input, ex. GH3P
        for (let i = 0; i < props.concentration.length; i++) {
            if (edge.data == props.title[i]) {
              // edge.style = {strokeWidth: props.concentration[i], stroke: 'red'};
              if (props.factorSteps.includes(i)) { // is a factor step
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
  }, [props.factors[0], props.factors[1], concentrations[0], setEdges]);

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