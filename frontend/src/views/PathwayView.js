import React, { Component } from 'react'
import './PathwayView.css'
import ModelArea from '../components/ModelArea'
import NavBar from '../components/NavBar'
import RightSideBarArea from '../components/RightSideBarArea';

export default class PathwayView extends Component {
  render() {
    return (
      <div className="container-fluid" id='MainView'>
        <div className="row" id="NavBarRow">
          {/* <NavBar /> */}
        </div>

        {/* the pathway view, left, and right sidebar divs are going to 
            be held in columns
         */}
        <div className="row" id="PathwayViewRow">
          <div className="col" id="ModelAreaCol">
            <ModelArea/>
          </div>
          <div className="col-md-auto" id="RightSideBarAreaCol">
            <RightSideBarArea/>
          </div>
        </div>
      </div>
    )
  }
}