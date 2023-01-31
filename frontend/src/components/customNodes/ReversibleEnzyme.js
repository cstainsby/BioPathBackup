import React, { memo } from 'react';
import { Handle } from 'reactflow';
import skiPass from '../../images/skiPass.jpg'

export default memo(({ data, isConnectable }) => {
  return (
    <>
      <Handle
        type="target"
        position="top"
        id="tt"
        style={{left: 10, top: 20, background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      {/* <Handle
        type="source"
        position="top"
        id="ts"
        style={{ left: 50, background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      /> */}
      <div>
        Reversible Enzyme <strong>{data.label}</strong>
        {/* <img src="../../images/skiPass.jpg" alt="skiPass"/> */}
      </div>
      {/* <input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} /> */}
      <Handle
        type="source"
        position="bottom"
        id="bs"
        style={{left: 130, bottom: 20, background: '#555' }}
        isConnectable={isConnectable}
      />
      {/* <Handle
        type="target"
        position="bottom"
        id="bt"
        style={{ left: 100, background: '#555' }}
        isConnectable={isConnectable}
      /> */}
    </>
  );
});
