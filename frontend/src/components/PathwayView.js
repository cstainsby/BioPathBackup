import React, { Component, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import FlowModel from './FlowModel'
import NavBar from './NavBar'
import Error from "./Error";

import './css/PathwayView.css'


import userInputInteractionList from './PathwayInteractiveComponent';
import ConcentrationManager from './utils/ConcentrationManager';
import FlowBuilder from './FlowBuilder';

export default class PathwayView extends Component {
  constructor(props) {
    super(props);

    this.concentrationManager = new ConcentrationManager();
  }

  render() {
    const pathwayView = <div className="container-fluid" id='MainView'>
                          <div className="row" id="NavBarRow">
                            <NavBar />
                          </div>

                          {/* the pathway view, left, and right sidebar divs are going to 
                              be held in columns
                          */}
                          <div className="row" id="PathwayViewRow">
                            <div className="col" id="ModelAreaCol">
                              <FlowModel 
                                concentrationManager= {this.concentrationManager}
                              />
                              {/* <FlowBuilder></FlowBuilder> */}
                              
                            </div>
                          </div>
                        </div>

    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ pathwayView }>
            <Route path="pathway/:pathwayID" element={ pathwayView }/>
          </Route>

          {/* for user authentication later on,  */}
          <Route path="auth" element={ pathwayView }>
          </Route>
          <Route path="*" element={ <Error /> }/>
        </Routes>
      </BrowserRouter>
    )
  }
}

