import React, { Component } from 'react'
import './Slider.css'

export default class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {value: 5};
  }

  handleChange(e) {
    this.setState((state, props) => ({
      value: e
    }));
  }

  render() {
    return (
      <div className='Slider'>
        {this.props.title}
        <input type="range"
          min={0}
          max={10}
          onChange={(e) => this.handleChange(e.target.value)}
          value={this.state.value}
          />
          <h1>{this.state.value}</h1>
      </div>
    )
  }
}
