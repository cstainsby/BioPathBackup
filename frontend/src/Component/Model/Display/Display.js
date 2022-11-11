import React from 'react';
import CompletedMoleculeInfo from './Modal';
import 'bootstrap/dist/css/bootstrap.css';
import Reaction from './Reaction';
import ReactionEdit from "./ReactionEdit"

let enzymes = ['Hexokinase', 'Enzyme2', 'Enzyme3'];

function NewReaction(props) {
  if(props.current == props.index){
    return <Reaction index = {props.index} substrate = {props.substrate} enzyme = {props.enzyme} displayselected = {props.current} current={true} onFinished = {props.onFinished}/>;
  } else {
    return <Reaction index = {props.index} substrate = {props.substrate} enzyme ={props.enzyme} displayselected = {props.current} current = {false} onFinished = {props.onFinished}/>;
  }
};

class Display extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      show: false,
      currentReactionAnimated: 0,
      completed: this.props.complete,
      unsolvedArray: [],
      incomplete: this.props.total - this.props.complete,
      substrateData: [],
      enzymeData: [],
      completedEnzymeData: [],
      selectedEnzyme: 0,
    }
    this.animateNextReaction = this.animateNextReaction.bind(this);
  }

  showModal(reactionNum) {
    this.setState({
      selectedReaction: reactionNum,
      selectedEnzyme: this.state.enzymeData[reactionNum].enzyme,
    }, () => {
      this.setState({
        show: !this.state.show,
      });
      console.log(this.state.selectedReaction);
    });

  };

  setData(data, type){
    if(type == "enzymes"){
      this.setState({enzymeData: data});
      const dummyArray = [];
      for(var i = 0; i < this.state.completed; i++){
        dummyArray[i] = this.state.enzymeData[i];
      }
      this.setState({completedEnzymeData: dummyArray});
    }
    if(type == "substrate"){
      this.setState({substrateData: data});
      console.log(this.state.substrateData);
    }
  }

  componentDidMount(){
    console.log("There are " + (this.state.incomplete) + " reactions left to be complete.")
    fetch('/modules')
      .then((res) => res.json())
      .then(data => {
        this.setData(data, "enzymes");
      }, []);
    fetch('/substrates')
      .then((res) => res.json())
      .then(data => {
        this.setData(data, "substrate")
      }, []);

  }

  animateNextReaction(){
    this.setState({currentReactionAnimated: this.state.currentReactionAnimated + 1});
  }

  solvedNextReaction(){
    this.setState({
      completed: (parseInt(this.state.completed) + 1),
      incomplete: (parseInt(this.state.incomplete) - 1)
    }, () => {
      let dummyArray = [];
      for(var i = 0; i < this.state.completed; i++){
        dummyArray[i] = this.state.enzymeData[i];
      }
      this.setState({completedEnzymeData: dummyArray});
    });
  }

  // gets substrates, enzymes, products, and reversible from reactionEdit
  handleElements = (reactionEditData) =>{
    console.log("hello");
    this.setState({substrates: reactionEditData.substrates});
    this.setState({enzyme: reactionEditData.enzyme});
    this.setState({products: reactionEditData.products});
    this.setState({reversible: reactionEditData.reversible});
    console.log(this.state.substrates);
  }

  render(){
    return (
      <div className = "wholeDisplay">
          <ul> {/* list of elements already completed */}
            {this.state.completedEnzymeData.map((item, index)=>{
              return (
                <div className = "reactionContainer" key = {index} onClick = {e => {this.showModal(index)}}>
                  <NewReaction
                    key = {index}
                    index = {index}
                    substrate = {this.state.substrateData[index]?.substrate ?? "Not Loaded Yet"}
                    enzyme = {this.state.enzymeData[index]?.enzyme ?? "Not Loaded Yet"}
                    current={this.state.currentReactionAnimated}
                    onFinished = {() => this.animateNextReaction()}
                  />
                </div>
                );
            })}
          </ul>
          <ul>
            {this.state.unsolvedArray.map((item,index)=>{
              return(
                <div className = "unsolvedContainer" key = {index}>{item}</div>
              );
            })}
          </ul>
          <p style = {{textAlign: 'center'}}>Progress: {this.state.completed} / {this.props.total}</p>
          <div id = "nextReaction">
          <div>
              <ReactionEdit elementsCallback = {this.handleElements}/>
              <button
                data-bs-toggle='modal'
                data-bs-target='#modal-ReactionEdit'
              >
                Next Reaction
              </button>
          </div>
          </div>
          <button onClick={e => {this.solvedNextReaction()}} className = "solveButton">Solve!</button>

          <CompletedMoleculeInfo
            onClose = {() => this.showModal(this.state.selectedReaction)}
            show={this.state.show}
            substrate = {this.state.substrateData[this.state.selectedReaction]?.substrate}
            enzyme={this.state.enzymeData[this.state.selectedReaction]?.enzyme}
            enzymeInfo={this.state.enzymeData[this.state.selectedReaction]?.reversible}
            product = {this.state.substrateData[this.state.selectedReaction + 1]?.substrate}
            id = {(this.state.selectedReaction + 1)}
            total={this.props.total}
          />


      </div>

    );
  }
}

export default Display;
