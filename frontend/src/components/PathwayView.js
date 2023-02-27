import React, { Component, useState, useEffect } from 'react'

import FlowModel from './reactFlowComponents/FlowModel'



import ConcentrationManager from './utils/ConcentrationManager';
import { useLoaderData } from 'react-router-dom';


/**
 * 
 * @prop {int} pathwayId 
 * @returns A react component containing the 
 */
const PathwayView = (props) => {
  const pathway = useLoaderData();

  const [isMinimized, setIsMinimized] = useState(false);
  
  let [concentrationManager, setConcentrationManager] = useState(new ConcentrationManager());

  return (
    <div id="ModelAreaCol">
      <FlowModel 
        concentrationManager = {concentrationManager}
        pathwayJson = {pathway}
      />
      
    </div>
  );
}


export default PathwayView;