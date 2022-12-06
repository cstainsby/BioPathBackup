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
  //  slidersTitle: string 
  //  slidersDescription: string

  let [pathway, setPathway] = useState(null);

  useEffect(() => {

  }, [])

  // const handleLoadNewPathway = (pathwayJson) => {
  //   const newTitles = findSliders(pathwayJson)["sliders"];
  //   setTitles(newTitles);
  // }

  const handleSliderChange = (cofactorTitle, newConcentration) => {
    const newConcentrationObj ={
      cofactorTitle: cofactorTitle,
      newConcentration: newConcentration
    }

    props.handleConcentrationChange(newConcentrationObj);
  }

  const handleSliderOpen = (cofactorTitle, newOpenStatus) => {
    if(newOpenStatus === true) {
      // close all others when another slider has been set to open
    }
  }

  const sliderItems = props.titles.map((title) => 
      <li>
        <Slider 
          title={title}
          handleSliderChange={ handleSliderChange } />
      </li>
    );

    return (
      <div className='card ModelAreaChild' id='PathwaySliderBox'>
        <h3 id="sliderComponentTitle">{ props.slidersTitle }</h3>
        {( props.slidersDescription != "") && <p><small class="text-muted">{ props.slidersDescription }</small></p> }
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
  let [sliderValue, setSliderValue] = useState(1.0);

  const handleSliderValueChange = (newSliderValue) => {
    setSliderValue(newSliderValue);

    props.handleSliderChange(props.title, newSliderValue);
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
        <li><h5>{props.title}</h5></li>
      </ul>

    const closeHeader = 
      <button className='cardHeaderDropdownButton' onClick={(e) => handleClick(e.target.value)}>
        <ul id='cardHeaderList'>
          <li><img id='cardHeaderCaret' src={dropdownLogo} style={{ transform: "rotate(-90deg)"}}  /></li>
          <li><h5>{props.title}</h5></li>
          <li><small class="text-muted">{ sliderValue * 100 }%</small></li>
        </ul>
      </button>

    const cardContents = 
      <div className='card-body sliderCardContents'>
        <input 
          id="concentrationSlider"
          className='slider'
          type="range"
          min={0.0}
          step={0.1}
          max={2.0}
          onChange={(e) => handleSliderValueChange(e.target.value)}
          value={sliderValue}
          />
        <p className='card-text'>{parseInt(sliderValue * 100)}% of concentration</p> {/* parseInt because 110% was giving a long float */}
      </div>
      

  return (
    <div className='card growCard' id='sliderCard'>
      { isExpanded ? openHeader : closeHeader}
      { isExpanded ? cardContents : null }
    </div>
  )

}

export default SliderSideBar;