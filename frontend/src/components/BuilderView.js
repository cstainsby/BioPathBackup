import React, { Component, useState, useEffect } from 'react'

import FlowBuilder from './reactFlowComponents/FlowBuilder'


/**
 * 
 * @prop {int} pathwayId 
 * @returns A react component containing the 
 */
const BuilderView = (props) => {

  return (
    <div id="ModelAreaCol">
      <FlowBuilder></FlowBuilder>
      
    </div>
  );
}


export default BuilderView;