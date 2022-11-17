import React, {useCallback, useEffect, useState} from 'react'
import './ModelArea.css'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useEdges, // new for concentration manipulation
  getConnectedEdges,
  applyEdgeChanges,
  updateEdge,
  useReactFlow,
} from 'reactflow'
import { runConcentrations, run, run2 } from '../utils';
import { nodes as initialNodes, edges as initialEdges } from './initial-elements';


import 'reactflow/dist/style.css';
import './overview.css';


const UpdatableEdge = (props) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  var [concentrations, setConcentrations] = useState(props.concentration);

  const [edgeName, setEdgeName] = useState(100);

  const onConnect = useCallback((params) => setEdges((els) => addEdge(params, els)), []);

  useEffect(() => {
    setConcentrations((conc) => 
      concentrations = run(props.concentration, props.reversibleSteps, props.stopSteps)
    );
    setEdges((eds) =>
      eds.map((edge) => {
        // for loop is needed for edges that have the same input, ex. GH3P
        // O(N^2) so might need to change if its too slow for later pathways
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
  }, [props.concentration[0], props.concentration[1], props.concentration[2], props.concentration[3], props.concentration[4], props.concentration[5], props.concentration[6], props.concentration[7],  setEdges]);

  // setInterval(setEdgeName(), 1000);

  return (
    <div className='ModelArea'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        snapToGrid
        // onEdgeUpdate={setEdgeName}
        onConnect={onConnect}
        fitView
        attributionPosition="top-right"
      >
        <Controls />
        {/* <button onClick={(e) => runConcentrations(2)}>test runConcentration</button> */}
      </ReactFlow>
    </div>
  );
};

export default UpdatableEdge;