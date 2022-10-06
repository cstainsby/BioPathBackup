import React, { Component, onClick } from 'react'
import './Slider.css'

export default class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {value: 5, isShowing: true};
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
    const isShown = this.state.isShowing;
    let button;

    if (isShown) {
      return (
        <div className='Slider'>
          <p>{this.props.title} <button onClick={(e) => this.handleClick(e.target.value)}>Close Slider</button></p>
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

    else {
      return (
        <div><button onClick={(e) => this.handleClick(e.target.value)}>Show</button></div>
        // <div className='Slider'>
        //   {this.props.title}
        //   <input type="range"
        //     min={0}
        //     max={10}
        //     onChange={(e) => this.handleChange(e.target.value)}
        //     value={this.state.value}
        //     />
        //     <h1>{this.state.value}</h1>
        // </div>
      )
      }
  }
}
