import React, { Component } from 'react'
import './PathwayView.css'
import ModelArea from '../components/ModelArea'
import NavBar from '../components/NavBar'
import SliderBar from '../components/SliderBar'

export default class PathwayView extends Component {
  render() {
    return (
      <div>
        <NavBar/>
        <ModelArea/>
        <SliderBar/>
      </div>
    )
  }
}