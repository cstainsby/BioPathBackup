import React, { memo } from 'react';
import { Handle } from 'reactflow';

const MOLECULE_WIDTH = 60;
const HANDLE_OFFSET = 15;

const Molecule = memo(({ data, isConnectable }) => {
    let MOLECULE_CENTER = MOLECULE_WIDTH / 2;
    return (<>
        <Handle
            type="target"
            position="top"
            id="top-target"
            style={{left: MOLECULE_CENTER - HANDLE_OFFSET, top: 1, background: '#555' }}
            onConnect={(params) => console.log('handle onConnect', params)}
            isConnectable={isConnectable}
        />
        <Handle
            type="source"
            position="top"
            id="top-source"
            style={{ left: MOLECULE_CENTER + HANDLE_OFFSET, top: 1, background: '#555' }}
            onConnect={(params) => console.log('handle onConnect', params)}
            isConnectable={isConnectable}
        />
        <div>
            <strong>{data.label}</strong>
        </div>
        {/* <input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} /> */}
        <Handle
            type="source"
            position="bottom"
            id="bottom-source"
            style={{left: MOLECULE_CENTER - HANDLE_OFFSET, bottom: 1, background: '#555' }}
            isConnectable={isConnectable}
        />
        <Handle
            type="target"
            position="bottom"
            id="bottom-target"
            style={{ left: MOLECULE_CENTER + HANDLE_OFFSET, bottom: 1, background: '#555' }}
            isConnectable={isConnectable}
        />
    </>);
});

export { Molecule }