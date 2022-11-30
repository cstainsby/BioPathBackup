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
      title: window.localStorage.getItem("RightSideBarTitle") || ""
    };

    this.props.dataObserver.subscribe("loadPathway", this.handleLoadNewPathway);
  }

  handleLoadNewPathway = (pathwayJson) => {
    const newTitle = pathwayJson.name;
    window.localStorage.setItem("RightSideBarTitle", newTitle);
    
    this.setState({
      title: newTitle
    });
  }

  // For now just set the RightSideBarArea to the 
  render() {
    return (
      <div id="RightSideBarArea">
        { (this.state.title !== "") && <h2 id='PathwayTitle'>{ this.state.title }</h2> }
        <SliderSideBar 
          title="Cofactors"
          description=""
          dataObserver={this.props.dataObserver}
        />
      </div>
    );
  }
}