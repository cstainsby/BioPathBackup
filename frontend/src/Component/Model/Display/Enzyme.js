import React from 'react';
import moleculeUrl from './images/enzyme.png';

class Enzyme extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      rotation: 90,
    }
  }

  startSpinning(){
    this.setRotation = setInterval(() => {
      this.setState({rotation: this.state.rotation - 4.5});
    }, 50);
  }

  componentDidMount(){
    if(this.props.completed){
      this.setState({rotation: 270});
    }
    if(this.props.current){
      this.setStartRotationInteval = setInterval(() => {
        this.startSpinning();
      }, 8000);
    }
  }

  componentWillUnmount(){
    clearInterval(this.setStartRotationInteval);
  }

  render(){
    let rotation = "rotate(" + this.state.rotation + "deg)";
    return (
      <img src={moleculeUrl} alt = "Enzyme Img Missing" className = "enzymeImg" style={{transform: rotation}}/>
    );
  }
}

export default Enzyme;
