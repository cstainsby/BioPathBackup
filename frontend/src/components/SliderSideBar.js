import React, { Component } from 'react'
import './SliderBar.css'
import Slider from './Slider.js'


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
      componentDesc: "desc"      
    }
  }

  render() {
    return (
      <div className='SliderBar'>
        <h3>{ this.state.title }</h3>
        <p>{ this.state.desc }</p>
        <ul>
          <li><Slider title="ATP" isShowing={true}/></li>
          <li><Slider title="HCL" isShowing={true}/></li>
          <li><Slider title="dCL" isShowing={false}/></li>
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
      this.state = {value: 1, isShowing: true};
    }
    else {
      this.state = {value: 1, isShowing: this.props.isShowing};
    }
  }

  handleChange(e) {
    this.setState((state, props) => ({
      value: e
    }));
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
    if (this.state.isShowing) {
      return (
        <div className='Slider'>
          <p>{this.props.title} <button onClick={(e) => this.handleClick(e.target.value)}>Close Slider</button></p>
          <input type="range"
            min={0.0}
            step={0.1}
            max={2.0}
            onChange={(e) => this.handleChange(e.target.value)}
            value={this.state.value}
            />
            <p>{parseInt(this.state.value * 100)}% of concentration</p> {/* parseInt because 110% was giving a long float */}
        </div>
      )
    }

    else {
      // comment out return statement if you don't want it to show at all
      return (
        <div><button onClick={(e) => this.handleClick(e.target.value)}>Show</button></div>
      )
      }
  }
}

