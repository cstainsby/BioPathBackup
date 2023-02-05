import React, { Component, useState, useEffect } from 'react'

import FlowModel from './reactFlowComponents/FlowModel'

//import Restore from './Restore';
import './css/PathwayView.css'

import ConcentrationManager from './utils/ConcentrationManager';
import { useLoaderData } from 'react-router-dom';


/**
 * 
 * @prop {int} pathwayId 
 * @returns A react component containing the 
 */
const PathwayView = (props) => {
  const pathway = useLoaderData();
  console.log("pathway in pathwayView " +  JSON.stringify(pathway))
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


// Possible entrypoints to find pathway
// 1. your most recent pathways
// 2. class pathways 
// 3. highest rated pathways from community 
// 4. 
const NavagationCard = () => {


  return (
    <div class="card w-50">
      <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <a href="#" class="btn btn-primary">Button</a>
      </div>
    </div>
  )
}


export default PathwayView;