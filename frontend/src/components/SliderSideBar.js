import React, { Component } from 'react'
import "./css/SliderSideBar.css";

import dropdownLogo from "../icons/arrow-down-sign-to-navigate.png";


// ----------------------------------------------------------------------
// SliderBar
//  This component when rendered will be a LeftSideBar component
//  where it will have control over the rates of reactions for the 
//  pathway currently being rendered 
// ----------------------------------------------------------------------
export default class SliderSideBar extends Component {
  constructor(props) {
    super(props);
    
    this.state = { 
      componentTitle: "title",    
      componentDescription: "description",
      titles: props.titles // needed for mapping dynamic list of cofactors
    }
  }

  render() {

    const sliderItems = this.state.titles.map((title) => 
      <li>
        <Slider title={title} onConcentrationChange={this.props.onConcentrationChange}/>
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

    this.eventTypeId = "Update Concentration Data";


    let {title, isShowing} = this.props
    if (isShowing === undefined) {
      this.state = {title: title, value: 1, isShowing: true};
    }
    else {
      this.state = {title: title, value: 1, isShowing: this.props.isShowing};
    }
  }

  handleChange(e) {
    this.setState((state, props) => ({
      value: e
    }));
    this.props.onConcentrationChange(e, this.state.title) // needed for passing state up
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
          onChange={(e) => this.handleChange(e.target.value)}
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

