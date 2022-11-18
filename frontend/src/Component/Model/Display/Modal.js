import React from 'react';

export default class CompletedMoleculeInfo extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      number: this.props.number,
      substrate: this.props.substrate,
      cofactor: this.props.cofactor,
      enzyme: this.props.enzyme,
      product: this.props.product
    }
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  render() {

    if(!this.props.show){
      return null;
    }

    return(
        <div className = "infoContainer" onClick={e => e.stopPropagation()}>
          <h3 className = "moleculeInfoHeader">Reaction Information</h3>
          <h4 className="reactionModalNumber">Reaction {this.props.id} of {this.props.total}</h4>

          <h5 className="moleculeInfoHeader">Substrates: {this.props.substrate}</h5>
          <div className = "infoSpacerDiv" />
          <p className="moleculeInfo"></p>
          <div className = "infoSpacerDiv2" />

          <h5 className="moleculeInfoHeader">Cofactors:</h5>
          <div className = "infoSpacerDiv" />
          <p className="moleculeInfo"></p>
          <div className = "infoSpacerDiv2" />

          <h5 className="moleculeInfoHeader">Enzyme: {this.props.enzyme}</h5>
          <div className = "infoSpacerDiv" />
          <p className="moleculeInfo">{this.props.enzymeInfo}</p>
          <div className = "infoSpacerDiv2" />

          <h5 className="moleculeInfoHeader">Products: {this.props.product}</h5>
          <div className = "infoSpacerDiv" />
          <p className="moleculeInfo"></p>
          <div className = "infoSpacerDiv2" />

          <button onClick={e => {this.onClose(e)}} className="button">Close Modal</button>
        </div>

    );
  }
}
