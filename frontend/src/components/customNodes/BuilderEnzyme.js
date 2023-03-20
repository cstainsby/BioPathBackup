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

const BuilderEnzyme = memo(({ data, isConnectable }) => {
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
        <img src={image} width="120" height="80" alt="enzymeImage"/>
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

export { BuilderEnzyme }