import React, {useContext, useState} from "react";

function BuilderSideBar(props) {

  return (
    <div className='card ModelAreaChild' id='PathwaySliderBox'>
            <button className="btn btn-primary" style={{margin: "10px"}} onClick={props.onAddMolecule}>Add Molecule</button>
            <button className="btn btn-primary" style={{margin: "10px"}} onClick={props.onAddEnzyme}>Add Enzyme</button>
            <BuildEnzymeModal onNewEnzyme={props.onNewEnzyme}></BuildEnzymeModal>
            <BuildMoleculeModal onNewMolecule={props.onNewMolecule}></BuildMoleculeModal>
            
        </div>
  );
}


const BuildEnzymeModal = (props) => {
    let data = {
        label: null,
        substrates: [],
        products: [],
        reversible: "False"
    }

    function handleLabelChange(e) {
        data.label = e.target.value
    }

    function handleSubstrateChange(e) {
        data.substrate = e.target.value
    }

    function handleProductChange(e) {
        data.product = e.target.value
    }

    function handleReversibleChange(e) {
        data.reversible = e.target.value
    }

    function handleSubmit(event) {
        props.onNewEnzyme(data)
    }

    return (
        <li className="nav-item dropdown">
              <a className="button-primary" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                New Enzyme
              </a>
              <ul className="dropdown-menu">
                <li>
                    <form onSubmit={handleSubmit}>
                        <label>
                        Enzyme Name
                        <input type="text" onChange={handleLabelChange} />
                        </label>
                        <label>
                        Substrate List
                        <input type="text" onChange={handleSubstrateChange} />
                        </label>
                        <label>
                        Product List
                        <input type="text" onChange={handleProductChange} />
                        </label>
                        <label>
                        Reversible
                        <input type="text" onChange={handleReversibleChange} />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>    
                </li>
              </ul>
        </li>
    );
}


const BuildMoleculeModal = (props) => {
    let data = {
        label: null,
        substrates: [],
        products: [],
        reversible: "False"
    }

    function handleLabelChange(e) {
        data.label = e.target.value
    }

    function handleSubmit(event) {
        props.onNewMolecule(data);
    }

    return (
        <li className="nav-item dropdown">
              <a className="button-primary" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                New Molecule
              </a>
              <ul className="dropdown-menu">
                <li>
                    <form onSubmit={handleSubmit}>
                        <label>
                        Molecule Name
                        <input type="text" onChange={handleLabelChange} />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>    
                </li>
              </ul>
        </li>
    );
}

export default BuilderSideBar;