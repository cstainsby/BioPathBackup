import React, { Component } from 'react'
import './PathwayView.css'
import ModelArea from '../components/ModelArea'
import NavBar from '../components/NavBar'
import RightSideBarArea from '../components/RightSideBarArea';

export default class PathwayView extends Component {
  render() {
    return (
      <div className='MainView'>
        <NavBar />

        {/* the pathway view, left, and right sidebar divs are going to 
            be held in columns
         */}
        <div class="row" className="PathwayView">
          <div class="col" className="ModelArea">
            <ModelArea/>
          </div>
          <div class="col" className="RightSideBarArea">
            {/* <RightSideBarArea/> */}
          </div>
        </div>
      </div>
    )
  }
}