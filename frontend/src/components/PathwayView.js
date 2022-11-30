import React, { Component, useState, useEffect } from 'react'

import ModelArea from './ModelArea'
import NavBar from './NavBar'
// import SliderBar from '../components/SliderBar'
import RightSideBarArea from './RightSideBarArea';
import Restore from './Restore';
import './css/PathwayView.css'

// import { findMolecules, findSliders } from '../components/simpleJSON'; // maybe delete later
import { buildFlow, findMolecules, findSliders } from './utils/pathwayComponentUtils';
import userInputInteractionList from './PathwayInteractiveComponent';

export default class PathwayView extends Component {
  constructor(props) {
    super(props);

    // this.handleConcChange = this.handleConcChange.bind(this)

    // setup observers for all inputs which affect the pathway 
    //  this observer list will be passed into each of the non-modelArea 
    //  components
    this.pathwayUserInputSubList = new userInputInteractionList;
  }

  render() {
    return (
      <div className="container-fluid" id='MainView'>
        <div className="row" id="NavBarRow">
          <NavBar dataObserver={ this.pathwayUserInputSubList } />
        </div>

        {/* the pathway view, left, and right sidebar divs are going to 
            be held in columns
         */}
        <div className="row" id="PathwayViewRow">
          <div className="col" id="ModelAreaCol">
            <ModelArea 
              dataObserver={ this.pathwayUserInputSubList }/>
          </div>

          <div className="col-md-auto" id="RightSideBarAreaCol">
            <RightSideBarArea dataObserver={ this.pathwayUserInputSubList }/>
          </div>
        </div>
      </div>
    )
  }
}

