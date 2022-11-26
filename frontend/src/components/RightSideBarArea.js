import React, { Component } from 'react';
import SliderSideBar from './SliderSideBar';

import { findSliders } from './utils/pathwayComponentUtils';



// ----------------------------------------------------------------------
// RightSideBarArea
//  This component when rendered will be the container for all 
//  informational items which may live within the right sidebar
// ----------------------------------------------------------------------
export default class RightSideBarArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Factor Molecules',
      sliderNames: findSliders()[0]
      // used for testing delete later
      // sliderNames: ['Glucose', 'G6P', 'F6P', 'F1,6BP', 'DHAP', 'GH3P', '1,3BPG']
    }
  }


  // For now just set the RightSideBarArea to the 
  render() {
    return (
      <div id="RightSideBarArea">
        <SliderSideBar 
          titles={this.state.sliderNames}
          onConcentrationChange={this.props.onConcentrationChange}
        />
      </div>
    );
  }
}

// ----------------------------------------------------------------------
// userInputInteractionList
//  This stack object will exclusivly deal in storing active rightSideBar
//    Components which the user can currently interact with, it will have
//    a function which can be used to get the current status of the bars
//  It will be the interface the pathway model will use to interact with
//    the user's input
// ----------------------------------------------------------------------
class userInputInteractionList {
  constructor() {
    this.dataInputs = [];
  }

  // attach an observer at the 
  attachObserverAtIndex(index) {

  }
  
  push() {

  }
  
  remove(index) {
    
  }
}