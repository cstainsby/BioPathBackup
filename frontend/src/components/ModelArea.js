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

const initialNodes = [
  { 
    id: '1e',
    position: { x: 0, y: (groupHeight + 20) * 0 },
    data: {label: 'Hexokinase'},
    type: 'group',
    style: {
      width: 170,
      height: groupHeight,
    },
  },
  { 
    id: '2e',
    position: { x: 0, y: (groupHeight + 20) * 1 },
    data: {label: ''},
    type: 'group',
    style: {
      width: 170,
      height: groupHeight,
    },
  },
  { 
    id: '3e',
    position: { x: 0, y: (groupHeight + 20) * 2 },
    data: {label: null},
    type: 'group',
    style: {
      width: 170,
      height: groupHeight,
    },
  },
  { 
    id: '4e',
    position: { x: 0, y: (groupHeight + 20) * 3 },
    data: {label: null},
    type: 'group',
    style: {
      width: 170,
      height: groupHeight,
    },
  },
  { 
    id: '5e',
    position: { x: 0, y: (groupHeight + 20) * 4 },
    data: {label: null},
    type: 'group',
    style: {
      width: 170,
      height: groupHeight,
    },
  },
  { 
    id: '6e',
    position: { x: 0, y: (groupHeight + 20) * 5 },
    data: {label: null},
    type: 'group',
    style: {
      width: 170,
      height: groupHeight,
    },
  },
  { 
    id: '7e',
    position: { x: 0, y: (groupHeight + 20) * 6 },
    data: {label: null},
    type: 'group',
    style: {
      width: 170,
      height: groupHeight,
    },
  },
  { 
    id: '8e',
    position: { x: 0, y: (groupHeight + 20) * 7 },
    data: {label: null},
    type: 'group',
    style: {
      width: 170,
      height: groupHeight,
    },
  },
  { 
    id: '9e',
    position: { x: 0, y: (groupHeight + 20) * 8 },
    data: {label: null},
    type: 'group',
    style: {
      width: 170,
      height: groupHeight,
    },
  },
  { 
    id: '10e',
    position: { x: 0, y: (groupHeight + 20) * 9},
    data: {label: null},
    type: 'group',
    style: {
      width: 170,
      height: groupHeight,
    },
  },
  { 
    id: '1s',
    position: { x: 10, y: 10 },
    data: { label: 'Glucose' },
    parentNode: '1e',
    extent: 'parent',
    draggable: false,
  },
  { 
    id: '2s',
    position: { x: 10, y: 60 },
    data: { label: 'Glucose-6-phosphate' },
    parentNode: '1e',
    extent: 'parent',
    draggable: false,
  },
  { 
    id: '3s',
    position: { x: 10, y: 10 },
    data: { label: 'Glucose-6-phosphate' },
    parentNode: '2e',
    extent: 'parent',
    draggable: false,
  },
  {
    id: '4s',
    position: { x: 10, y: 60 },
    data: { label: 'Fructose-6-phosphate' },
    parentNode: '2e',
    extent: 'parent',
    draggable: false,
  },
  {
    id: '5s',
    position: { x: 10, y: 10 },
    data: { label: 'Fructose-6-phosphate' },
    parentNode: '3e',
    extent: 'parent',
    draggable: false,
  },
  {
    id: '6s',
    position: { x: 10, y: 60 },
    data: { label: 'Fructose-1,6-bisphosphate' },
    parentNode: '3e',
    extent: 'parent',
    draggable: false,
  },
  { 
    id: '7s',
    position: { x: 10, y: 10 },
    data: { label: 'Glucose' },
    parentNode: '4e',
    extent: 'parent',
    draggable: false,
  },
  { 
    id: '8s',
    position: { x: 10, y: 60 },
    data: { label: 'Glucose-6-phosphate' },
    parentNode: '4e',
    extent: 'parent',
    draggable: false,
  },
  { 
    id: '9s',
    position: { x: 10, y: 10 },
    data: { label: 'Glucose' },
    parentNode: '5e',
    extent: 'parent',
    draggable: false,
  },
  { 
    id: '10s',
    position: { x: 10, y: 60 },
    data: { label: 'Glucose-6-phosphate' },
    parentNode: '5e',
    extent: 'parent',
    draggable: false,
  },
  { 
    id: '11s',
    position: { x: 10, y: 10 },
    data: { label: 'Glucose' },
    parentNode: '6e',
    extent: 'parent',
    draggable: false,
  },
  { 
    id: '12s',
    position: { x: 10, y: 60 },
    data: { label: 'Glucose-6-phosphate' },
    parentNode: '6e',
    extent: 'parent',
    draggable: false,
  },
  { 
    id: '13s',
    position: { x: 10, y: 10 },
    data: { label: 'Glucose' },
    parentNode: '7e',
    extent: 'parent',
    draggable: false,
  },
  { 
    id: '14s',
    position: { x: 10, y: 60 },
    data: { label: 'Glucose-6-phosphate' },
    parentNode: '7e',
    extent: 'parent',
    draggable: false,
  },
  { 
    id: '15s',
    position: { x: 10, y: 10 },
    data: { label: 'Glucose' },
    parentNode: '8e',
    extent: 'parent',
    draggable: false,
  },
  { 
    id: '16s',
    position: { x: 10, y: 60 },
    data: { label: 'Glucose-6-phosphate' },
    parentNode: '8e',
    extent: 'parent',
    draggable: false,
  },
  { 
    id: '17s',
    position: { x: 10, y: 10 },
    data: { label: 'Glucose' },
    parentNode: '9e',
    extent: 'parent',
    draggable: false,
  },
  { 
    id: '18s',
    position: { x: 10, y: 60 },
    data: { label: 'Glucose-6-phosphate' },
    parentNode: '9e',
    extent: 'parent',
    draggable: false,
  },
  { 
    id: '19s',
    position: { x: 10, y: 10 },
    data: { label: 'Glucose' },
    parentNode: '10e',
    extent: 'parent',
    draggable: false,
  },
  { 
    id: '20s',
    position: { x: 10, y: 60 },
    data: { label: 'Glucose-6-phosphate' },
    parentNode: '10e',
    extent: 'parent',
    draggable: false,
  },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: '2s',
    target: '3s' 
  }
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
