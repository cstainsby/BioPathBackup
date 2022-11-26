import React, { Component, useState, useEffect } from 'react'

import ModelArea from './ModelArea'
import NavBar from './NavBar'
// import SliderBar from '../components/SliderBar'
import RightSideBarArea from './RightSideBarArea';
import Restore from './Restore';
import './css/PathwayView.css'

// import { findMolecules, findSliders } from '../components/simpleJSON'; // maybe delete later
import { findMolecules, findSliders } from './utils/pathwayComponentUtils';
import userInputInteractionList from './PathwayInteractiveComponent';

export default class PathwayView extends Component {
  constructor(props) {
    super(props);

    const molecules_concentrations = findMolecules(); // a list of [[molecules], [baseConcentrations]]

    this.state = {
      // titles: ['Glucose', 'G6P', 'F6P', 'F1,6BP', 'DHAP', 'GH3P', '1,3BPG'],
      titles: molecules_concentrations[0],
      // concentrations: [100, 100, 100, 100, 100, 100, 100],
      concentrations: molecules_concentrations[1], 
      factorTitle: findSliders()[0],
      factors: findSliders()[1], // represents the percent value from sliders
      factorSteps: [0],
      reversibleSteps: [2],
      stopSteps: [5],
      loadedPathway: null
    }

    this.handleConcChange = this.handleConcChange.bind(this)

    // setup observers for all inputs which affect the pathway 
    //  this observer list will be passed into each of the non-modelArea 
    //  components
    this.pathwayUserInputSubList = new userInputInteractionList;
    this.pathwayUserInputSubList.subscribe("concentrationChange", this.handleConcChange);
    this.pathwayUserInputSubList.subscribe("loadPathway", this.handlePathwayLoad);
  }

  /* Function to change the concentration from an adjustment from a slider
      TODO: Change to handle dynamic titles based on what is received from api
      currently hard coded pretty hard but works
  */
  handleConcChange(changesJson) { 
    let changesObj = JSON.parse(changesJson);
    let title = changesObj.title;
    let concentration = changesObj.concentration;

    console.log("handling concentration change: title: " + title + " concentration: " + concentration);

    // this is where the issue is coming from

    // for (let i = 0; i < this.state.concentrations.length; i++) {
    //   if (this.state.titles[i] === title) {
    //     var tempConcentrations = this.state.concentrations
    //     var newConcentration = 10 * concentration

    //     tempConcentrations[i] = newConcentration

    //     this.setState((state, props) => ({
    //       concentrations: tempConcentrations
    //     }));
    //   }
    // }
    // // this is for changing cofactor ratio
    // for (let i = 0; i < this.state.factors.length; i++) {
    //   if (this.state.factorTitle[i] === title) {
        
    //     var tempPercents = this.state.factors;
    //     var newPercent = 1 * concentration;
    //     tempPercents[i] = newPercent;

    //     this.setState((state, props) => ({
    //       factors: tempPercents
    //     }));
    //   }
    // }
  }

  handlePathwayLoad = (newPathwayJson) => {
    console.log("handle pathway load: " + JSON.stringify(newPathwayJson));
    
    this.setState({
      loadedPathway: newPathwayJson
    });
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
              title={this.state.titles} 
              stopSteps={this.state.stopSteps} 
              concentration={this.state.concentrations} 
              reversibleSteps={this.state.reversibleSteps} 
              factorSteps={this.state.factorSteps} 
              factors={this.state.factors}
              pathwayJson={this.loadedPathway}/>
          </div>

          <div className="col-md-auto" id="RightSideBarAreaCol">
            <RightSideBarArea dataObserver={ this.pathwayUserInputSubList }/>
          </div>
        </div>
      </div>
    )
  }
}

