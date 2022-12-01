import React, { Component } from 'react';
import SliderSideBar from './SliderSideBar';

import menuLogo from "../icons/menu.png";
import "./css/RightSideBarArea.css";
import "./css/stylesheet.css";

import boogyImg from "../images/boogy.PNG"

// ----------------------------------------------------------------------
// RightSideBarArea
//  This component when rendered will be the container for all 
//  informational items which may live within the right sidebar
// ----------------------------------------------------------------------
export default class RightSideBarArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: window.localStorage.getItem("RightSideBarTitle") || "",
      isOpen: false,

      additionalImage: boogyImg
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

  // handleChangeSideBarToggle = () => {
  //   const isOpenState = !this.state.isOpen;
  //   console.log("is open toggled to: " + isOpenState)
    

  //   window.localStorage.setItem("RideSideBarMenuToggle", JSON.stringify(isOpenState));
  //   this.setState({
  //     isOpen: isOpenState
  //   });
  // }

  // For now just set the RightSideBarArea to the 
  render() {
    return (
      <div id="RightSideBarArea">
        { (this.state.title !== "") && (
          <div id="RightSideBarPathwayDisplay">
            <ul id='RightSideBarList'>
              <li><img src={ menuLogo } width="30" height="auto" className='growButton'></img></li>
              <li><h2 id='PathwayTitle'>{ this.state.title }</h2></li>
            </ul>

            <div class="card mb-3" id='RightSideBarDescription'>
              <div class="row g-0">
                {this.state.additionalImage && 
                  <div class="col-md-4">
                    <img src={ this.state.additionalImage } className="img-fluid rounded-start"/>
                  </div>
                }
                
                <div class="col-md-8">
                  <div class="card-body">
                    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                    {/* <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p> */}
                  </div>
                </div>
              </div>
            </div>

            <SliderSideBar 
              title="Cofactors"
              description=""
              dataObserver={this.props.dataObserver}
            />
          </div>
        )}
      </div>
    );
  }
}