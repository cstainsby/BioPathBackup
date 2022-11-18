import React from 'react';
import Display from './Display/Display.js';
import Menus from './Menus/Menus.js';

class Model extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        fullData: [],
        completedData : [],
        incompleteData : [],
        numComplete: this.props.numComplete
      };
    }

    setData(data){
      this.setState({fullData: data});
    }

    componentDidMount(){
      fetch('/pathways')
        .then((res) => res.json())
        .then(data => {
          this.setData(data)
        }, []);
    }

    render(){
      return (
        <div className = "entireReaction">
          <p style = {{textAlign: 'center'}}>Currently working on: {this.state.fullData[0]?.modelName ?? "Model Not Loaded"}</p>
          <Display complete = {this.state.numComplete} total = {13} completedData = {this.state.completeData} data = {this.state.fullData}/>
          <Menus name = {this.props.name} data = {this.state.fullData}/>
        </div>
      );
    }
}

export default Model;
