import React, { memo } from 'react';
import { Handle } from 'reactflow';

/**
 * Reactflow Node for BuilderEnzymes
 */
const BuilderEnzyme = memo(({ data, isConnectable }) => {
    return (
        <>
            <Handle
                type="target"
                position="top"
                id="top-target"
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
                isConnectable={isConnectable}
            />
        </>
    );
});

export { BuilderEnzyme };
