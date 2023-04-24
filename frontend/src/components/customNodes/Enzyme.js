import React, { memo } from 'react';
import { Handle } from 'reactflow';
import aldolase from '../../images/glycolysis/aldolase.png';
import enolase from '../../images/glycolysis/enolase.png';
import hexokinase from '../../images/glycolysis/hexokinase.png';
import phosphofructokinase from '../../images/glycolysis/phosphofructokinase.png';
import phosphoglucose_isomerase from '../../images/glycolysis/phosphoglucose isomerase.png';
import phosphoglycerate_kinase from '../../images/glycolysis/phosphoglycerate kinase.png';
import phosphoglycerate_mutase from '../../images/glycolysis/phosphoglycerate mutase.png';
import pyruvate_kinase from '../../images/glycolysis/pyruvate kinase.png';
import triose_phosphate_isomerase from '../../images/glycolysis/triose phosphate isomerase.png';
import triose_phosphate_dehydrogenase from '../../images/glycolysis/GAPDH.png'

const ENZYME_WIDTH = 250;

// TODO: Make image imports dynamic
const Enzyme = memo(({ data, isConnectable }) => {
    let image = null;
    if (data.image === "aldolase") {
        image = aldolase;
    }
    else if (data.image === "enolase") {
        image = enolase;
    }
    else if (data.image === "hexokinase") {
        image = hexokinase;
    }
    else if (data.image === "phosphofructokinase") {
        image = phosphofructokinase;
    }
    else if (data.image === "phosphoglucose isomerase") {
        image = phosphoglucose_isomerase;
    }
    else if (data.image === "phosphoglycerate kinase") {
        image = phosphoglycerate_kinase;
    }
    else if (data.image === "phosphoglycerate mutase") {
        image = phosphoglycerate_mutase;
    }
    else if (data.image === "pyruvate kinase") {
        image = pyruvate_kinase;
    }
    else if (data.image === "triose phosphate dehydrogenase") {
        image = triose_phosphate_dehydrogenase;
    }
    else {
        image = triose_phosphate_isomerase
    }

    const getHandleLocation = (i, num, offset) => {
        return ((i + 1)/(num + 1)) * ENZYME_WIDTH + offset
    }

    const generateTopHandles = (data) => {
        let handles = [];
        for (let i = 0; i < data.substrates.length; i++) {
            handles.push(
                <Handle
                    type="target"
                    position="top"
                    id={"top-target-" + i.toString()}
                    style={{left: getHandleLocation(i, data.substrates.length, -15), background: '#555' }}
                    onConnect={(params) => console.log('handle onConnect', params)}
                    isConnectable={isConnectable}
                    key={"top-target-" + i.toString()}
                />
            );
            handles.push(
                <Handle
                    type="source"
                    position="top"
                    id={"top-source-" + i.toString()}
                    style={{ left: getHandleLocation(i, data.substrates.length, 15), background: '#555' }}
                    onConnect={(params) => console.log('handle onConnect', params)}
                    isConnectable={isConnectable}
                    key={"top-source-" + i.toString()}
                />
            );
        }
        return handles;
    }

    const generateBottomHandles = (data) => {
        let handles = [];
        for (let i = 0; i < data.products.length; i++) {
            handles.push(
                <Handle
                    type="source"
                    position="bottom"
                    id={"bottom-source-" + i.toString()}
                    style={{ left: getHandleLocation(i, data.products.length, -15), background: '#555' }}
                    onConnect={(params) => console.log('handle onConnect', params)}
                    isConnectable={isConnectable}
                    key={"bottom-source-" + i.toString()}
                />
            );
            handles.push(
                <Handle
                    type="target"
                    position="bottom"
                    id={"bottom-target-" + i.toString()}
                    style={{left: getHandleLocation(i, data.products.length, 15), background: '#555' }}
                    onConnect={(params) => console.log('handle onConnect', params)}
                    isConnectable={isConnectable}
                    key={"bottom-target-" + i.toString()}
                />
            );
        }
        return handles;
    }

    return (<>
        {generateTopHandles(data)}
        <div>
            <strong>{data.label}</strong>
            <img src={image} width="120" height="80" alt="enzymeImage"/>
        </div>
        {/* <input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} /> */}
        {generateBottomHandles(data)}
    </>);
});

export {Enzyme}