import React, {useContext, useState, useEffect} from "react";

import { getEnzymes, getMolecules, postMolecule, postEnzyme } from '../requestLib/requests';

import './BuilderSideBar.css'

function BuilderSideBar(props) {
    const [moleculeResp, setMoleculeResp] = useState(null);
    const [enzymeResp, setEnzymeResp] = useState(null);
    const [enzymes, setEnzymes] = useState();
    const [molecules, setMolecules] = useState();
    const [reload, setReload] = useState(true); // used to call db when new stuff posted

    useEffect(() => { 
        if (moleculeResp != null) {
            const dropDownItems = moleculeResp.map((item, index) => 
                <option value={index}>{item["name"]}</option>
            );
            setMolecules(dropDownItems);
        }
        if (enzymeResp != null) {
            const dropDownItems = enzymeResp.map((item, index) => 
                <option value={index}>{item["name"]}</option>
            );
            setEnzymes(dropDownItems);
        }
        if (reload) {
            callGetEnzymes();
            callGetMolecules();
        }

    }, [moleculeResp, enzymeResp, reload]);

    function callGetMolecules() {
        setReload(false)
        getMolecules()
        .then(moleculeResp => setMoleculeResp(moleculeResp));
    }

    function callGetEnzymes() {
        setReload(false)
        getEnzymes()
        .then(enzymeResp => setEnzymeResp(enzymeResp));
    }

    function onMoleculeSelect(selectedMolecule) {
        console.log(reload, "checking reload")
        props.onAddMolecule(moleculeResp[selectedMolecule])
    }

    function onEnzymeSelect(selectedEnzyme) {
        props.onAddEnzyme(enzymeResp[selectedEnzyme])
    }

  return (
    <div className='card ModelAreaChild' id='PathwaySliderBox'>
            {/* <button className="btn btn-primary" style={{margin: "10px"}} onClick={props.onAddMolecule}>Add Molecule</button> */}
            <select onChange={(e) => onMoleculeSelect(e.target.value)}>
                <option>Select Molecule</option>
                {molecules}
            </select>
            <select onChange={(e) => onEnzymeSelect(e.target.value)}>
                <option>Select Enzyme</option>
                {enzymes}
            </select>
            {/* <button className="btn btn-primary" style={{margin: "10px"}} onClick={props.onAddEnzyme}>Add Enzyme</button> */}
            <BuildEnzymeModal onNewEnzyme={props.onNewEnzyme} resetDropDowns={setReload} dropDownItems={molecules} moleculeResp={moleculeResp}></BuildEnzymeModal>
            <BuildMoleculeModal onNewMolecule={props.onNewMolecule} resetDropDowns={setReload}></BuildMoleculeModal>
            <TestModal></TestModal>
            
        </div>
  );
}

const BuildEnzymeModal = (props) => {
    const [id, setID] = useState(null);
    const [name, setName] = useState(null);
    const [abbreviation, setAbbrevation] = useState(null);
    const [substrates, setSubstrates] = useState([]);
    const [products, setProducts] = useState();
    const [reversible, setReversible] = useState("false");

    let data = {
        name: null,
        substrates: [],
        products: [],
        reversible: "false"

    }

    function handleClick() {

        const enzymeObj = {
            "name": name,
            "abbreviation": abbreviation,
            "reversible": reversible === 'true',
            "image": null,
            "link": null,
            "public": true,
            "author": 1,
            "substrates": substrates,
            "products": products,
            "cofactors": [341]
        }
        postEnzyme(enzymeObj);

        props.resetDropDowns(true);

        props.onNewEnzyme(enzymeObj);

        // clear state for next new enzyme
        setName(null);
        setAbbrevation(null);
        setSubstrates([]);
        setProducts([]);
        setReversible("false");
    }

    function handleNewSubstrate(selectedSubstrate) { // adds new selected molecule to substrate list
        setSubstrates(substrates => [...substrates,props.moleculeResp[selectedSubstrate].id] )
    }

    function handleNewProduct(selectedProduct) { // adds new selected molecule to substrate list
        setProducts(products => [...products,props.moleculeResp[selectedProduct].id] )
    }

    return (
        // <li className="nav-item dropdown">
        //       <a className="button-primary" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        //         New Enzyme
        //       </a>
        //       <ul className="dropdown-menu">
                // <li>
                //     <button onClick={handleClick}>Submit New Enzyme</button>
                //     <label>
                //     Enzyme Name
                //     <input type="text" onChange={e => setName(e.target.value)} />
                //     </label>
                //     <label>
                //     Enzyme Abbreviation
                //     <input type="text" onChange={e => setAbbrevation(e.target.value)} />
                //     </label>
                //     {/* <label>
                //     Substrate List
                //     <input type="text" onChange={e => setSubstrates(e.target.value)} />
                //     </label> */}
                //     <TestModal></TestModal>
                //     <label>
                //     Product List
                //     <input type="text" onChange={e => setProducts(e.target.value)} />
                //     </label>
                //     <label>
                //     Reversible
                //     <input type="text" onChange={e => setReversible(e.target.value)} />
                //     </label>
                // </li>
        //       </ul>
        // </li>
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                New Enzyme
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li>
                    <button onClick={handleClick}>Submit New Enzyme</button>
                    <label>
                    Enzyme Name
                    <input type="text" onChange={e => setName(e.target.value)} />
                    </label>
                    <label>
                    Enzyme Abbreviation
                    <input type="text" onChange={e => setAbbrevation(e.target.value)} />
                    </label>
                    <label>
                    Reversible
                    <input type="text" onChange={e => setReversible(e.target.value)} />
                    </label>
                </li>
                <li class="dropdown-submenu">
                <a class="dropdown-item" href="#">
                    Substrates
                </a>
                <ul class="dropdown-menu dropdown-submenu">
                <li>
                    <select onChange={(e) => handleNewSubstrate(e.target.value)}>
                        <option>Select Substrates</option>
                        {props.dropDownItems}
                    </select>
                </li>
                <li>
                    <select onChange={(e) => handleNewProduct(e.target.value)}>
                        <option>Select Products</option>
                        {props.dropDownItems}
                    </select>
                </li>
                </ul>
                </li>
            </ul>
            </div>
    )
}


const BuildMoleculeModal = (props) => {
    const [label, setLabel] = useState(null);
    const [abbr, setAbbr] = useState(null);
    const [id, setID] = useState(null);

    let data = {
        label: null,
        abbreviation: null,
        id: null
    }

    function handleSubmit(event) {
        data.label = label;
        data.abbreviation = abbr;
        data.id = id;

        const moleculeObj = {
            // "id": data.id,
            "name": data.label,
            "abbreviation": data.abbreviation,
            "ball_and_stick_image": null,
            "space_filling_image": null,
            "link": null,
            "public": true,
            "author": 1
        }
        postMolecule(moleculeObj);

        props.resetDropDowns(true);


        props.onNewMolecule(data);
    }

    return (
        <li className="nav-item dropdown">
              <a className="button-primary" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                New Molecule
              </a>
              <ul className="dropdown-menu">
                <li>
                    <button onClick={handleSubmit}>Submit New Molecule</button>
                    <label>
                    Molecule Name
                    <input type="text" onChange={e => setLabel(e.target.value)} />
                    </label>
                    <label>
                    Molecule Abbreviation
                    <input type="text" onChange={e => setAbbr(e.target.value)} />
                    </label>
                    {/* <label>
                    Molecule ID
                    <input type="text" onChange={e => setID(e.target.value)} />
                    </label> */}
                </li>
              </ul>
        </li>
    );
}

const TestModal = (props) => {
    return (
        <div className='dropdown dropstart'>
            <button className='btn' data-bs-toggle="dropdown" onClick={null}>
              Testing
            </button>
            <ul className="dropdown-menu">
              <li>Test</li>
              <li>Test2</li>
            </ul>
          </div>
    );
}

export default BuilderSideBar;