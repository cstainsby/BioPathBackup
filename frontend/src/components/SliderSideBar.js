import React, { Component } from 'react'
import "./css/SliderSideBar.css";

import dropdownLogo from "../icons/arrow-down-sign-to-navigate.png";
import { findSliders } from "./utils/pathwayComponentUtils"


// ----------------------------------------------------------------------
// SliderBar
//  This component when rendered will be a RightSideBar component
//  where it will have control over the rates of reactions for the 
//  pathway currently being rendered 
// ----------------------------------------------------------------------
export default class SliderSideBar extends Component {
  constructor(props) {
    super(props);

    this.props.dataObserver.subscribe("loadPathway", this.handleLoadNewPathway);
    

    this.state = { 
      componentTitle: props.title,    
      componentDescription: props.description,

      // needed for mapping dynamic list of cofactors
      titles: JSON.parse(window.localStorage.getItem("SliderSideBarTitles").split(",")) || []
    }
    console.log("retrieved: " + JSON.parse(window.localStorage.getItem("SliderSideBarTitles")))
    // console.log("of type " + typewindow.localStorage.getItem("SliderSideBarTitles")) 
  }

  handleLoadNewPathway = (pathwayJson) => {
    const newTitles = findSliders(pathwayJson)["sliders"];
    
    window.localStorage.setItem("SliderSideBarTitles", JSON.stringify(newTitles));
    console.log("Push to local storage " + JSON.stringify(newTitles))
    this.setState({
      titles: newTitles
    });
  }

  render() {

    const sliderItems = this.state.titles.map((title) => 
      <li>
        <Slider title={title} dataObserver={ this.props.dataObserver }/>
      </li>
    );
    
    return (
      <div className='SliderBar'>
        {/* <h3>{ this.state.componentTitle }</h3>
        <p>{ this.state.componentDescription }</p> */}
        <ul className='sliderBarList'>
          {/* <li><Slider title="ATP" isShowing={true}/></li>
          <li><Slider title="HCL" isShowing={true}/></li>
          <li><Slider title="dCL" isShowing={false}/></li> */}
          {sliderItems}
        </ul>
      </div>
    )
  }
}

class Slider extends Component {
  constructor(props) {
    super(props);

    let {title, isShowing} = this.props
    if (isShowing === undefined) {
      this.state = {title: title, value: 1, isShowing: true};
    }
    else {
      this.state = {title: title, value: 1, isShowing: this.props.isShowing};
    }
  }

  handleSliderValueChange(e) {
    this.setState((state, props) => ({
      value: e
    }));

    const jsonUpdateResponse = JSON.stringify({
      title : this.state.title,
      concentration : e
    });

    this.props.dataObserver.postEvent("concentrationChange", jsonUpdateResponse);
  }

  handleClick(e) {
    /* this function is for showing or removing factor molecules
        hopefully will be able to use pathway specific settings to show
        correct pathway specific molecules
        TODO: change from on/off based on buttons to based on pathway config
    */
    if (this.state.isShowing) {
      this.setState((state, props) => ({

        isShowing: false
      }));
    }
    else {
      this.setState((state, props) => ({
        isShowing: true
      }));
    }
  }


  render() {
    const openHeader = 
      <ul id='cardHeaderList'>
       <li>
          <button className='cardHeaderDropdownButton' onClick={(e) => this.handleClick(e.target.value)}>
            <img 
              id='cardHeaderCaret' 
              style={{
                transform: "rotate(-90deg)"
              }} 
              src={dropdownLogo} />
          </button>
        </li>
        <li><h4>{this.props.title}</h4></li>
      </ul>

    const closeHeader = 
      <button className='cardHeaderDropdownButton' onClick={(e) => this.handleClick(e.target.value)}>
        <ul id='cardHeaderList'>
          <li><img id='cardHeaderCaret' src={dropdownLogo} /></li>
          <li><h4>{this.props.title}</h4></li>
        </ul>
      </button>

    const cardContents = 
      <div className='sliderCardContents'>
        <input type="range"
          min={0.0}
          step={0.1}
          max={2.0}
          onChange={(e) => this.handleSliderValueChange(e.target.value)}
          value={this.state.value}
          />
        <p>{parseInt(this.state.value * 100)}% of concentration</p> {/* parseInt because 110% was giving a long float */}
      </div>

    const card = 
      <div className='card' id='sliderCard'>
        { this.state.isShowing ? openHeader : closeHeader}
        { !this.state.isShowing ? cardContents : null }
      </div>

    

    return card;
  }
}

