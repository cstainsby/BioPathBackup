import React, { memo } from 'react';
import { Handle } from 'reactflow';
import skiPass from '../../images/skiPass.jpg'

export default memo(({ data, isConnectable }) => {
  return (
    <>
      <Handle
        type="target"
        position="left"
        id="c"
        style={{background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      {/* <Handle
        type="source"
        position="top"
        id="d"
        style={{ left: 50, background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      /> */}
      <div>
        Reversible Enzyme <strong>{data.label}</strong>
      </div>
      <input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} />
      <Handle
        type="source"
        position="right"
        id="a"
        style={{background: '#555' }}
        isConnectable={isConnectable}
      />
      {/* <Handle
        type="target"
        position="bottom"
        id="b"
        style={{ right: 100, background: '#555' }}
        isConnectable={isConnectable}
      /> */}
    </>
  );
});
