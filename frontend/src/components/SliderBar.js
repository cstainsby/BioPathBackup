import React, { Component } from 'react'
import './SliderBar.css'
import Slider from './Slider.js'

export default class SliderBar extends Component {
  render() {
    return (
      <div className='SliderBar'>
        <ul>
          <li><Slider title={"ATP"}/></li>
          <li><Slider title={"HCL"}/></li>
        </ul>
      </div>
    )
  }
}
