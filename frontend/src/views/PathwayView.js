import React, { Component, useState, useEffect } from 'react'
import './PathwayView.css'
import ModelArea from '../components/ModelArea'
import NavBar from '../components/NavBar'
// import SliderBar from '../components/SliderBar'
import RightSideBarArea from '../components/RightSideBarArea';
import Restore from '../components/Restore'

// import { findMolecules, findSliders } from '../components/simpleJSON'; // maybe delete later
import { findMolecules, findSliders} from '../utils';

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
      stopSteps: [5]
    }
    this.handleConcChange = this.handleConcChange.bind(this)
  }

  /* Function to change the concentration from an adjustment from a slider
      TODO: Change to handle dynamic titles based on what is received from api
      currently hard coded pretty hard but works
  */
  handleConcChange(concentration, title){ //, title) {
    for (let i = 0; i < this.state.concentrations.length; i++) {
      if (this.state.titles[i] === title) {
        var tempConcentrations = this.state.concentrations
        var newConcentration = 10 * concentration
        tempConcentrations[i] = newConcentration
        this.setState((state, props) => ({
          concentrations: tempConcentrations
        }));
      }
    }
    // this is for changing cofactor ratio
    for (let i = 0; i < this.state.factors.length; i++) {
      if (this.state.factorTitle[i] === title) {
        console.log("test1", title);
        var tempPercents = this.state.factors;
        var newPercent = 1 * concentration;
        tempPercents[i] = newPercent;
        this.setState((state, props) => ({
          factors: tempPercents
        }));
      }
    }
  }

  render() {
    return (
      <div className="container-fluid" id='MainView'>
        <div className="row" id="NavBarRow">
          <NavBar />
        </div>

        {/* the pathway view, left, and right sidebar divs are going to 
            be held in columns
         */}
        <div className="row" id="PathwayViewRow">
          <div className="col" id="ModelAreaCol">
            {/* <Restore concentration={this.state.titles}/> */}
          <ModelArea title={this.state.titles} stopSteps={this.state.stopSteps} concentration={this.state.concentrations} reversibleSteps={this.state.reversibleSteps} factorSteps={this.state.factorSteps} factors={this.state.factors}/>
          </div>
          <div className="col-md-auto" id="RightSideBarAreaCol">
            <RightSideBarArea onConcentrationChange={this.handleConcChange}/>
          </div>
        </div>
      </div>
    )
  }
}