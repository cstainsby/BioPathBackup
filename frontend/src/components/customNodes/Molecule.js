import React, { memo } from 'react';
import { Handle } from 'reactflow';

export default memo(({ data, isConnectable }) => {
  return (
    <>
      <Handle
        type="target"
        position="top"
        id="top-target"
        style={{left: 50, background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position="top"
        id="top-source"
        style={{ left: 20, background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div>
        <strong>{data.label}</strong>
        {/* <img src="../../images/skiPass.jpg" alt="skiPass"/> */}
      </div>
      {/* <input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} /> */}
      <Handle
        type="source"
        position="bottom"
        id="bottom-source"
        style={{left: 50, background: '#555' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position="bottom"
        id="bottom-target"
        style={{ left: 20, background: '#555' }}
        isConnectable={isConnectable}
      />
    </>
  );
});
