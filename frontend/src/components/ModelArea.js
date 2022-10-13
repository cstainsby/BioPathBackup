import React, {useCallback} from 'react'
import './ModelArea.css'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow'
import 'reactflow/dist/style.css'

const groupHeight = 130;
const groupWidth1 = 120;
const groupWidth2 = 230;
const substrateHeight = 50
const substrateWidth = 100

const initialNodes = [
  { 
    id: '1e',
    position: { x: 0, y: (groupHeight + 20) * 0 },
    data: {label: 'Hexokinase'},
    type: 'group',
    style: {
      width: groupWidth2,
      height: groupHeight,
    },
  },
  { 
    id: '2e',
    position: { x: 0, y: (groupHeight + 20) * 1 },
    data: {label: ''},
    type: 'group',
    style: {
      width: groupWidth1,
      height: groupHeight,
    },
  },
  { 
    id: '3e',
    position: { x: 0, y: (groupHeight + 20) * 2 },
    data: {label: null},
    type: 'group',
    style: {
      width: groupWidth2,
      height: groupHeight,
    },
  },
  { 
    id: '4e',
    position: { x: 0, y: (groupHeight + 20) * 3 },
    data: {label: null},
    type: 'group',
    style: {
      width: groupWidth2,
      height: groupHeight,
    },
  },
  { 
    id: '5e',
    position: { x: substrateWidth + 10, y: (groupHeight + 20) * 4 },
    data: {label: null},
    type: 'group',
    style: {
      width: groupWidth1,
      height: groupHeight,
    },
  },
  { 
    id: '6e',
    position: { x: 0, y: (groupHeight + 20) * 5 },
    data: {label: null},
    type: 'group',
    style: {
      width: groupWidth2,
      height: groupHeight,
    },
  },
  { 
    id: 'starts',
    position: { x: 10, y: -70 },
    data: { label: 'Glucose' },
    style: {
      width: substrateWidth,
      height: substrateHeight,
    },
  },
  {
    id: '1s',
    position: { x: 10, y: 10 },
    data: { label: 'Glucose' },
    parentNode: '1e',
    extent: 'parent',
    style: {
      width: substrateWidth,
      height: substrateHeight,
    },
  },
  { 
    id: '2s',
    position: { x: 10, y: substrateHeight + 20 },
    data: { label: 'G6P' },
    parentNode: '1e',
    extent: 'parent',
    style: {
      width: substrateWidth,
      height: substrateHeight,
    },
  },
  {
    id: '1sc',
    position: { x: substrateWidth + 20, y: 10 },
    data: { label: 'ATP' },
    parentNode: '1e',
    extent: 'parent',
    style: {
      width: substrateWidth,
      height: substrateHeight,
    },
  },
  { 
    id: '2sc',
    position: { x: substrateWidth + 20, y: substrateHeight + 20 },
    data: { label: 'ADP' },
    parentNode: '1e',
    extent: 'parent',
    style: {
      width: substrateWidth,
      height: substrateHeight,
    },
  },
  { 
    id: '3s',
    position: { x: 10, y: 10 },
    data: { label: 'G6P' },
    parentNode: '2e',
    extent: 'parent',
    style: {
      width: substrateWidth,
      height: substrateHeight,
    },
  },
  {
    id: '4s',
    position: { x: 10, y: substrateHeight + 20 },
    data: { label: 'F6P' },
    parentNode: '2e',
    extent: 'parent',
    style: {
      width: substrateWidth,
      height: substrateHeight,
    },
  },
  {
    id: '5s',
    position: { x: 10, y: 10 },
    data: { label: 'F6P' },
    parentNode: '3e',
    extent: 'parent',
    style: {
      width: substrateWidth,
      height: substrateHeight,
    },
  },
  {
    id: '6s',
    position: { x: 10, y: substrateHeight + 20 },
    data: { label: 'F1,6BP' },
    parentNode: '3e',
    extent: 'parent',
    style: {
      width: substrateWidth,
      height: substrateHeight,
    },
  },
  {
    id: '3sc',
    position: { x: substrateWidth + 20, y: 10 },
    data: { label: 'ATP' },
    parentNode: '3e',
    extent: 'parent',
    style: {
      width: substrateWidth,
      height: substrateHeight,
    },
  },
  { 
    id: '4sc',
    position: { x: substrateWidth + 20, y: substrateHeight + 20 },
    data: { label: 'ADP' },
    parentNode: '3e',
    extent: 'parent',
    style: {
      width: substrateWidth,
      height: substrateHeight,
    },
  },
  { 
    id: '7s',
    position: { x: 10, y: 10 },
    data: { label: 'F1,6BP' },
    parentNode: '4e',
    extent: 'parent',
    style: {
      width: substrateWidth,
      height: substrateHeight,
    },
  },
  { 
    id: '8s',
    position: { x: 10, y: substrateHeight + 20 },
    data: { label: 'GH3P'},
    parentNode: '4e',
    extent: 'parent',
    style: {
      width: substrateWidth,
      height: substrateHeight,
    },
  },
  { 
    id: '8s2',
    position: { x: substrateWidth + 20, y: substrateHeight + 20 },
    data: { label: 'DHAP' },
    parentNode: '4e',
    extent: 'parent',
    style: {
      width: substrateWidth,
      height: substrateHeight,
    },
  },
  { 
    id: '9s',
    position: { x: 10, y: 10 },
    data: { label: 'DHAP' },
    parentNode: '5e',
    extent: 'parent',
    style: {
      width: substrateWidth,
      height: substrateHeight,
    },
  },
  { 
    id: '10s',
    position: { x: 10, y: substrateHeight + 20 },
    data: { label: 'GH3P' },
    parentNode: '5e',
    extent: 'parent',
    style: {
      width: substrateWidth,
      height: substrateHeight,
    },
  },
  { 
    id: '11s',
    position: { x: 10, y: 10 },
    data: { label: 'GH3P' },
    parentNode: '6e',
    extent: 'parent',
    style: {
      width: substrateWidth,
      height: substrateHeight,
    },
  },
  { 
    id: '12s',
    position: { x: 10, y: substrateHeight + 20 },
    data: { label: '1,3BPG' },
    parentNode: '6e',
    extent: 'parent',
    style: {
      width: substrateWidth,
      height: substrateHeight,
    },
  },
  {
    id: '5sc',
    position: { x: substrateWidth + 20, y: 10 },
    data: { label: 'NAD' },
    parentNode: '6e',
    extent: 'parent',
    style: {
      width: substrateWidth,
      height: substrateHeight,
    },
  },
  { 
    id: '6sc',
    position: { x: substrateWidth + 20, y: substrateHeight + 20 },
    data: { label: 'NADH' },
    parentNode: '6e',
    extent: 'parent',
    style: {
      width: substrateWidth,
      height: substrateHeight,
    },
  },
  { 
    id: 'ends',
    position: { x: 10, y: (groupHeight + 20) * 6 },
    data: { label: '1,3BPG' },
    style: {
      width: substrateWidth,
      height: substrateHeight,
    },
  },
];

const initialEdges = [
  {
    id: 'starts-1s',
    source: 'starts',
    target: '1s',
    animated: true,
    style: {
      strokeWidth: 10,
      stroke: 'red'
    }
  },
  {
    id: '2s-3s',
    source: '2s',
    target: '3s',
    animated: true,
    style: {
      strokeWidth: 10,
      stroke: 'red'
    }
  },
  {
    id: '4s-5s',
    source: '4s',
    target: '5s',
    animated: true,
    style: {
      strokeWidth: 10,
      stroke: 'red'
    }
  },
  {
    id: '6s-7s',
    source: '6s',
    target: '7s',
    animated: true,
    style: {
      strokeWidth: 10,
      stroke: 'red'
    }
  },
  {
    id: '8s2-9s',
    source: '8s2',
    target: '9s',
    animated: true,
    style: {
      strokeWidth: 10,
      stroke: 'red'
    }
  },
  {
    id: '10s-11s',
    source: '10s',
    target: '11s',
    animated: true,
    style: {
      strokeWidth: 10,
      stroke: 'red'
    }
  },
  {
    id: '8s-11s',
    source: '8s',
    target: '11s',
    animated: true,
    style: {
      strokeWidth: 10,
      stroke: 'red'
    }
  },
  {
    id: '12s-ends',
    source: '12s',
    target: 'ends',
    animated: true,
    style: {
      strokeWidth: 10,
      stroke: 'red'
    }
  },
  
];

export default function ModelArea() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params) =>
    setEdges((eds) =>
    addEdge(params, eds)), [setEdges]
  );

  return (
    <div className='ModelArea'>
      <ReactFlow 
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background variant='dots' />
      </ReactFlow>
    </div>
  )
}
