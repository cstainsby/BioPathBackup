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
    this.state = {
      title: 'Factor Molecules',
      // used for testing delete later
      // sliderNames: ['Glucose', 'G6P', 'F6P', 'F1,6BP', 'DHAP', 'GH3P', '1,3BPG']
    }
  }


  // For now just set the RightSideBarArea to the 
  render() {
    return (
      <div id="RightSideBarArea">
        <SliderSideBar 
          dataObserver={this.props.dataObserver}
        />
      </div>
    );
  }
}