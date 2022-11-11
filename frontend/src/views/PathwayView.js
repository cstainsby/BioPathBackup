import React, { Component, useState, useEffect } from 'react'
import './PathwayView.css'
import ModelArea from '../components/ModelArea'
import NavBar from '../components/NavBar'
import SliderBar from '../components/SliderBar'
import { runConcentrations } from '../utils' // added trying to get interactive concentrations
import {run} from '../utils'

export default class PathwayView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titles: ['Glucose', 'G6P', 'F6P', 'F1,6BP', 'DHAP', 'GH3P', '1,3BPG'], 
      concentrations: [100, 100, 100, 100, 100, 100, 100],
      factors: [1],
      factorSteps: [0, 2, 5],
      reversibleSteps: [1, 2, 5],
      stopSteps: [5]
    }
    this.handleConcChange = this.handleConcChange.bind(this)
    // const titles = ["ATP", "HCL", "dCL"]
  }

  /* Function to change the concentration from an adjustment from a slider
      Currently set to concx
      TODO: Change to handle dynamic titles based on what is recieved from api
      currently hard coded pretty hard but works
  */
  handleConcChange(concentration, title){ //, title) {
    for (let i = 0; i < this.state.concentrations.length; i++) {
      if (this.state.titles[i] === title) {
        var tempConcentrations = this.state.concentrations
        // if (this.state.factorSteps.includes(i)) { // affected by ATP
          var newConcentration = 100 * concentration
        // }
        // else { // not affected by ATP
        //   var newConcentration = 100
        // }
      tempConcentrations[i] = newConcentration
      this.setState((state, props) => ({
        concentrations: tempConcentrations
      }));
      }
    }
  }

  render() {
    return (
      <div className='PathwayView'>
        <NavBar/>
        <div className='pathwayViewArea'>
        <ModelArea title={this.state.titles} stopSteps={this.state.stopSteps} concentration={this.state.concentrations} reversibleSteps={this.state.reversibleSteps} factorSteps={this.state.factorSteps}/>
            <SliderBar 
              titles={['Glucose', 'G6P', 'F6P', 'F1,6BP', 'DHAP', 'GH3P', '1,3BPG']} 
              onConcentrationChange={this.handleConcChange}/>
        </div>
      </div>
    )
  }
}