import React, { useEffect, useState } from 'react';
import Molecule from "./Molecule.js";
import Enzyme from "./Enzyme.js";

function StyleContainer(props) {
  let displaySub = "";
  if(props.substrateEaten){
    displaySub = "none";
  }
  if(props.current){
    return (
      <div className = "individualReaction" style ={{backgroundColor: '#c9fcc7'}}>
        <Molecule index = {props.index} show = {displaySub}/>
        <p className = "moleculeLabelText" style={{marginTop: props.subTextPosition, display: displaySub}}>{props.substrate}</p>
        <Enzyme current = {props.current} completed = {props.completed}/>
        <p className = "enzymeLabelText">{props.enzyme}</p>
      </div>
    );
  } else {
    return(
      <div className = "individualReaction" style ={{backgroundColor: '#ffffff'}}>
        <Enzyme current = {props.current} completed = {props.completed}/>
        <p className = "enzymeLabelText">{props.enzyme}</p>
      </div>
    );
  }
};

class Reaction extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      current: this.props.current,
      substrate: "",
      enzyme: this.props.enzyme,
      rotation: 0,
      subTextPosition: 0,
      substrateEaten: false,
      completed: false
    }
    this.setNextReactionInterval = this.setNextReactionInterval.bind(this);
  }

  setNextReactionInterval() {

    //Exit after 10 seconds
    this.setClearInterval = setInterval(() => {
      console.log("Reaction using " + this.props.enzyme + " complete. Attempting to start next reaction...");
      this.props.onFinished();
    }, 10000);
    this.setEatInterval = setInterval(() => {
      this.setState({
        substrateEaten: true
      });
    }, 8000);
    this.setSubTextMoveInterval = setInterval(() => {
      this.setState({subTextPosition: this.state.subTextPosition + .15});
    }, 50);
  }

  componentDidMount(){
    if(this.props.current){
      this.setNextReactionInterval();
    }
  };

  componentDidUpdate(prevProps){
    if(this.props.current === true && this.state.current === false){
      this.setNextReactionInterval();
      this.setState({
        current: true,
        substrate: this.props.substrate
      });
      console.log(this.props.substrate);
    } else if (this.props.current === false && this.state.current === true) {
      this.setState({current: false, completed: true});
      clearInterval(this.setClearInterval);
      clearInterval(this.setSubTextMoveInterval);

    }
  }

  setBackground() {
    if(this.state.current == true){
      return "background-color: #66fc03";
    } else {
      return "background-color: #ffffff"
    }
  }

  render(){
    let position = this.state.subTextPosition + "vh";
    return (
      <StyleContainer
        current = {this.state.current}
        completed = {this.state.completed}
        substrate = {this.props.substrate}
        enzyme = {this.state.enzyme}
        subTextPosition = {position}
        substrateEaten = {this.state.substrateEaten}/>
    );
  }

}

export default Reaction;
