import React, { Component } from 'react';
import SliderSideBar from './SliderSideBar';



// ----------------------------------------------------------------------
// RightSideBarArea
//  This component when rendered will be the container for all 
//  informational items which may live within the right sidebar
// ----------------------------------------------------------------------
export default class RightSideBarArea extends Component {
  constructor(props) {
    super(props);
    this.state = {title: 'Factor Molecules'}
  }


  // For now just set the RightSideBarArea to the 
  render() {
    return (
      <div id="RightSideBarArea">
        <SliderSideBar/>
      </div>
    );
  }
}