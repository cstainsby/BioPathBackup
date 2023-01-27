import React, { memo } from 'react';
import { Handle } from 'reactflow';

export default memo(({ data, isConnectable }) => {
  return (
    <>
      <Handle
        type="target"
        position="top"
        id="c"
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position="top"
        id="d"
        style={{ bottom: 10, left: 'auto', background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div>
        Reversible Enzyme <strong>{data.label}</strong>
      </div>
      <input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} />
      <Handle
        type="source"
        position="bottom"
        id="a"
        style={{ left: 50, background: '#555' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position="bottom"
        id="b"
        style={{ right: 50, top: 'auto', background: '#555' }}
        isConnectable={isConnectable}
      />
    </>
  );
});
