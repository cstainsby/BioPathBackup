import React, { Component } from 'react'
import './SliderBar.css'
import Slider from './Slider.js'

export default class SliderBar extends Component {
  constructor(props) {
    super(props);
    this.state = {title: 'Factor Molecules'}
  }

  render() {
    return (
      <div className='SliderBar'>
        <h1>{this.state.title}</h1>
        <ul>
          <li><Slider title={"ATP"}/></li>
          <li><Slider title={"HCL"} isShowing={true}/></li>
          <li><Slider title={"dCL"} isShowing={false}/></li>
        </ul>
      </div>
    )
  }
}
