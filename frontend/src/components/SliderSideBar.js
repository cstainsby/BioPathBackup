import React, { Component, useEffect, useState } from 'react'

import "./css/SliderSideBar.css";
import "./css/stylesheet.css";

import dropdownLogo from "../icons/arrow-down-sign-to-navigate.png";
import { findSliders } from "./utils/pathwayComponentUtils";


// ----------------------------------------------------------------------
// SliderBar
//  This component when rendered will be a RightSideBar component
//  where it will have control over the rates of reactions for the 
//  pathway currently being rendered 
// ----------------------------------------------------------------------
const SliderSideBar = (props) => {
  // props that should be passed in:
  //  pathwayTitle: string 
  //  pathwayDescription: string

  let [pathway, setPathway] = useState(null);
  let [titles, setTitles] = useState([]);

  const handleLoadNewPathway = (pathwayJson) => {
    const newTitles = findSliders(pathwayJson)["sliders"];
    setTitles(newTitles);
  }

  const sliderItems = titles.map((title) => 
      <li>
        <Slider title={title} />
      </li>
    );

    return (
      <div className='card sliderBar text-start ModelAreaChild' id='PathwaySliderBox'>
        <h3 id="sliderComponentTitle">{ props.pathwayTitle }</h3>
        {( props.pathwayDescription != "") && <p>{ props.pathwayDescription }</p> }
        <ul className='sliderBarList'>
          {/* <li><Slider title="ATP" isShowing={true}/></li>
          <li><Slider title="HCL" isShowing={true}/></li>
          <li><Slider title="dCL" isShowing={false}/></li> */}
          {sliderItems}
        </ul>
      </div>
    )
}

const Slider = (props) => {
  // props that should be passed in:
  //  title: string 

  let [isExpanded, setIsExpanded] = useState(false);
  let [sliderValue, setSliderValue] = useState(50);

  const handleSliderValueChange = (newSliderValue) => {
    setSliderValue(newSliderValue);

    const jsonUpdateResponse = JSON.stringify({
      title : this.state.title,
      concentration : newSliderValue
    });
  }

  const handleClick = (e) => {
    setIsExpanded(!isExpanded);
  }

  const openHeader = 
      <ul id='cardHeaderList'>
       <li>
          <button className='cardHeaderDropdownButton' onClick={(e) => handleClick(e.target.value)}>
            <img 
              id='cardHeaderCaret' 
              src={dropdownLogo} />
          </button>
        </li>
        <li><h4>{props.title}</h4></li>
      </ul>

    const closeHeader = 
      <button className='cardHeaderDropdownButton' onClick={(e) => handleClick(e.target.value)}>
        <ul id='cardHeaderList'>
          <li><img id='cardHeaderCaret' src={dropdownLogo} style={{ transform: "rotate(-90deg)"}}  /></li>
          <li><h4>{props.title}</h4></li>
        </ul>
      </button>

    const cardContents = 
      <div className='sliderCardContents'>
        <input type="range"
          min={0.0}
          step={0.1}
          max={2.0}
          onChange={(e) => handleSliderValueChange(e.target.value)}
          value={sliderValue}
          />
        <p>{parseInt(sliderValue * 100)}% of concentration</p> {/* parseInt because 110% was giving a long float */}
      </div>
      

  return (
    <div className='card growCard' id='sliderCard'>
      { !isExpanded ? openHeader : closeHeader}
      { !isExpanded ? cardContents : null }
    </div>
  )

}

export default SliderSideBar;