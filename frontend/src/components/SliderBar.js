import React, { Component } from 'react'
import './SliderBar.css'
import Slider from './Slider.js'

export default class SliderBar extends Component {
  constructor(props) {
    super(props);
    this.state = {title: 'Factor Molecules', titles: props.titles}
  }

  render() {
    const sliderItems = this.state.titles.map((title) => 
      <li>
        <Slider title={title} onConcentrationChange={this.props.onConcentrationChange}/>
      </li>
    );
    return (
      <div className='SliderBar'>
        <h1>{this.state.title}</h1>
        <ul>
          {sliderItems}
        </ul>
      </div>
    )
  }
}
