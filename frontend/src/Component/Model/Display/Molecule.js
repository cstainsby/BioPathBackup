import React from 'react';
import substrateUrl from './images/aqua.png';


import aqua from ".//images/aqua.png";
import brown from ".//images/brown.png";
import darkblue from ".//images/darkblue.png";
import darkgray from ".//images/darkgray.png";
import darkred from ".//images/darkred.png";
import darkyellow from ".//images/darkyellow.png";
import lightgray from ".//images/lightgray.png";
import lightgreen from ".//images/lightgreen.png";
import lightred from ".//images/lightred.png";
import orange from ".//images/orange.png";
import pink from ".//images/pink.png";
import purple from ".//images/purple.png";
import skyblue from ".//images/skyblue.png";

const images = [aqua, brown, darkblue, darkgray, darkred, darkyellow, lightgray, lightgreen, lightred, orange, pink, purple, skyblue];

class Molecule extends React.Component{

  constructor(props){

    super(props);
    this.state = {
      moleculePosition: 0,
      rotation: 0,
    }
  }

  componentDidMount(){
    /*
    let options = [
      'aqua.png',
      'brown.png',
      'darkblue.png',
      'darkgray.png',
      'darkred.png',
      'darkyellow.png',
      'lightgray.png',
      'lightgreen.png',
      'lightred.png',
      'orange.png',
      'pink.png',
      'purple.png',
      'skyblue.png'
    ];
    */
    let myMolecule = Math.floor(Math.random() * images.length);
    console.log(myMolecule);
    this.setState({moleculeImg: myMolecule});
    this.positionInterval = setInterval(() => {
      this.setState({moleculePosition: this.state.moleculePosition + .15});
    }, 50);
    this.rotationInterval = setInterval(() => {
      this.setState({
        rotation: this.state.rotation + 5
      });
    }, 30);
  };

  componentWillUnmount(){
    clearInterval(this.positionInterval);
    clearInterval(this.rotationInterval);
  }

  render(){
    let position = this.state.moleculePosition + "vh";
    let rotation = "rotate(" + this.state.rotation + "deg)";
    return(
        <img src={images[this.state.moleculeImg]} alt = "Substrate Img Missing" className = "moleculeImg" style={{marginTop: position, transform: rotation, display: this.props.show}}/>
    );
  }

}

export default Molecule;
