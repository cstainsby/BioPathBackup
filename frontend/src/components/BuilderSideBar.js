import React, {useContext, useState, useEffect} from "react";

import { getEnzymes, getMolecules } from '../requestLib/requests';

function BuilderSideBar(props) {
    const [resp, setResp] = useState(null);
    const [enzymes, setEnzymes] = useState();
    const [molecules, setMolecules] = useState();

    // getEnzymes().then(
    //     res => {
    //         setEnzymes(res);
    //     }
    // )

    useEffect(() => { 
        if (resp != null) {
            console.log(resp, "resp")
            const dropDownItems = resp.map((item, index) => 
                <option value={index}>{item["name"]}</option>
                // console.log(item["id"], item["name"], index, "map function")
            );
            setMolecules(dropDownItems);
        }

    }, [resp]);

    function callGetMolecules() {
        if (!resp) {
            getMolecules()
            // .then(res => res.json())
            .then(res => setResp(res));
        }
    }

    function onMoleculeSelect(selectedMolecule) {
        props.onAddMolecule(resp[selectedMolecule])
    }

  return (
    <div className='card ModelAreaChild' id='PathwaySliderBox'>
            {/* <button className="btn btn-primary" style={{margin: "10px"}} onClick={props.onAddMolecule}>Add Molecule</button> */}
            <select onClick={() => callGetMolecules()} onChange={(e) => onMoleculeSelect(e.target.value)}>
                <option>Select Molecule</option>
                {molecules}
            </select>
            <button className="btn btn-primary" style={{margin: "10px"}} onClick={props.onAddEnzyme}>Add Enzyme</button>
            <BuildEnzymeModal onNewEnzyme={props.onNewEnzyme}></BuildEnzymeModal>
            <BuildMoleculeModal onNewMolecule={props.onNewMolecule}></BuildMoleculeModal>
            
        </div>
  );
}


const BuildEnzymeModal = (props) => {
    const [label, setLabel] = useState();
    const [substrates, setSubstrates] = useState([]);
    const [products, setProducts] = useState([]);
    const [reversible, setReversible] = useState("false");


    let data = {
        label: null,
        substrates: [],
        products: [],
        reversible: "False"
    }

    // function handleLabelChange(e) {
    //     data.label = e.target.value
    // }

    // function handleSubstrateChange(e) {
    //     data.substrate = e.target.value
    // }

    // function handleProductChange(e) {
    //     data.product = e.target.value
    // }

    // function handleReversibleChange(e) {
    //     data.reversible = e.target.value
    // }

    function handleSubmit(event) {
        data.label = label;
        data.substrates = [substrates]; 
        data.products = [products];
        data.reversible = [reversible];

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
                        {/* <input type="text" onChange={handleLabelChange} /> */}
                        <input type="text" onChange={e => setLabel(e.target.value)} />
                        </label>
                        <label>
                        Substrate List
                        {/* <input type="text" onChange={handleSubstrateChange} /> */}
                        <input type="text" onChange={e => setSubstrates(e.target.value)} />
                        </label>
                        <label>
                        Product List
                        {/* <input type="text" onChange={handleProductChange} /> */}
                        <input type="text" onChange={e => setProducts(e.target.value)} />
                        </label>
                        <label>
                        Reversible
                        {/* <input type="text" onChange={handleReversibleChange} /> */}
                        <input type="text" onChange={e => setReversible(e.target.value)} />
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