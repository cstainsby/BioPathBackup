import React, { memo } from 'react';
import { Handle } from 'reactflow';

/**
 * Reactflow Node for BuilderMolecules
 */
const BuilderMolecule = memo(({ data, isConnectable }) => {
    return (
        <>
            <Handle
                type="target"
                position="top"
                id="top-source"
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
                isConnectable={isConnectable}
            />
        </>
    );
});

export { BuilderMolecule };
