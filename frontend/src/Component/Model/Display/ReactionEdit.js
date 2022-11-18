import React, { useState, Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import Accordion from 'react-bootstrap/Accordion'
// import Select from 'react-select'


class ReactionEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            substrates: [],
            enzyme: "",
            products: [],
            reversible: true,

            elementDict: {
              substrates: [],
              enzyme: "",
              products: [],
              reversible: true
            },

            substrateList: ["1,3-bisphoglycerate", "2 phosphoglycerate", "3 phosphoglycerate",
                            "ATP", "Dihydroxyacetone Phosphate", "Fructose-1,6-bisphosphate",
                            "Fructose-6-Phosphate", "Glucose", "Glucose-6-Phosphate", 
                            "Glyceraldehyde-3-Phosphate", "Phosphoenolpyruvate"],

            subCheck: [],

            enzymeList:     [
                            { value: "Aldolase", label: "Aldolase" },
                            { value: "Enolase", label: "Enolase" },
                            { value: "Glyceraldehyde phosphate dehydrogenase", label: "Glyceraldehyde phosphate dehydrogenase" },
                            { value: "Hexokinase", label: "Hexokinase" },
                            { value: "Phosphofructokinase", label: "Phosphofructokinase" },
                            { value: "Phosphoglucose isomerase", label: "Phosphoglucose isomerase" },
                            { value: "Phosphoglycerate kinase", label: "Phosphoglycerate kinase" },
                            { value: "Phosphoglycerate mutase", label: "Phosphoglycerate mutase" },
                            { value: "Pyruvate kinase", label: "Pyruvate kinase" },
                            { value: "Triosephosphate isomerase", label: "Triosephosphate isomerase" }
                            ],


            productList: ["1,3-bisphoglycerate", "2 phosphoglycerate", "3 phosphoglycerate",
                          "ADP", "Dihydroxyacetone Phosphate", "Fructose-1,6-bisphosphate",
                          "Fructose-6-Phosphate", "Fructose-6-Phosphate", "Glucose-6-Phosphate", 
                          "Glyceraldehyde-3-Phosphate", "Pyruvate"],

            prodCheck: [],
            
            reversibleList: [{ value: true, label: "Reversible"}, { value: false, label: "Irreversible"}],
        };

      // create boolean lists that match substrate and product lists
      // used to see if checkbox is checked
      this.state.subCheck = new Array(this.state.substrateList.length).fill(false);
      this.state.prodCheck = new Array(this.state.productList.length).fill(false);

    }


    componentDidMount(){
      //this is where you call to set dynamically
    }

    handleSubstrate(e){
        console.log("In handle substrate");
        console.log(e.target.value);
        const { value, checked } = e.target;
        const index = this.state.substrateList.findIndex(substrate => substrate === e.target.value);
        if (checked){
          this.state.subCheck[index] = true;
          this.state.substrates.push(e.target.value);
        }
        else{
          this.state.subCheck[index] = false;
          this.state.substrates.splice(index, 1);
        }
        console.log(this.state.subCheck[index]);
        this.state.elementDict.substrates = this.state.substrates;
        console.log(this.state.elementDict.substrates)
    }

    handleProduct(e){
      console.log("In handle product");
      console.log(e.target.value);
      const { value, checked } = e.target;
        const index = this.state.productList.findIndex(product => product === e.target.value);
        if (checked){
          this.state.prodCheck[index] = true;
          this.state.products.push(e.target.value);
        }
        else{
          this.state.prodCheck[index] = false;
          this.state.products.splice(index, 1);
        }
        console.log(this.state.prodCheck[index]);
        this.state.elementDict.products = this.state.products;
    }

    handleReversible(selectedReversible){
      console.log("In handle reversible");
      if (selectedReversible == "Reversible"){
        this.setState({reversible: true});
        this.state.elementDict.reversible = true;
      }
      else {
        this.setState({reversible: false});
        this.state.elementDict.reversible = false;
      }
      console.log(this.state.reversible)
    }

    handleEnzyme(selectedEnzyme){
      console.log(this.state.enzyme)
      console.log("In handle enzyme");
      this.setState({enzyme: selectedEnzyme});
      this.state.elementDict.enzyme = selectedEnzyme;
      console.log(this.state.enzyme)
    }

    createReaction = (e) => {
      this.props.elementsCallback(this.state.elementDict);
  }

    render(){

        return (
          // -1 allows you to close modal using esc
          <div className='modal fade' id='modal-ReactionEdit' > 
            <div className='modal-dialog'> 
              <div className='modal-content'>

        
            <Accordion>

            <Accordion.Item eventKey="0">
                <Accordion.Header>REVERSIBLE/IRREVERSIBLE</Accordion.Header>
                <Accordion.Body>
                <select 
                  onChange={e => this.handleReversible(e.target.value)}>
                    <option value="Reversible">Reversible</option>
                    <option value="Ireversible">Irreversible</option>
              </select>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1">
                <Accordion.Header>SUBSTRATES</Accordion.Header>
                <Accordion.Body>
                  {this.state.substrateList.map((item, index) => (
                    <div key={index}>
                    <input value={item} type="checkbox" onClick={e=>{this.handleSubstrate(e)}}/>
                    <span>{' '}{item}</span>
                  </div>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
        
              <Accordion.Item eventKey="2">
                <Accordion.Header>ENZYMES</Accordion.Header>
                <Accordion.Body>
                  <select 
                    onChange={e => this.handleEnzyme(e.target.value)}>
                      {this.state.enzymeList.map((enzyme)=> <option value={enzyme.value}>{enzyme.label}</option>)}
                  </select>
                </Accordion.Body>
              </Accordion.Item>
        
              <Accordion.Item eventKey="3">
                <Accordion.Header>PRODUCTS</Accordion.Header>
                <Accordion.Body>
                {this.state.productList.map((item, index) => (
                    <div key={index}>
                    <input value={item} type="checkbox" onClick={e=>{this.handleProduct(e)}}/>
                    <span>{' '}{item}</span>
                  </div>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
        
            <button className = "reaction_action_button" onClick={e=>{this.createReaction(e)}} >
              Create Reaction
            </button>
            
            
        
            </div>
            </div>
            </div>
        )
    }
}
export default ReactionEdit;