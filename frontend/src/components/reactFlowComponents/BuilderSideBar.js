import React, {useContext, useState, useEffect} from "react";

import { getEnzymes, getMolecules, postMolecule, postEnzyme } from '../../requestLib/apiRequests';

import '../css/BuilderSideBar.css'

function BuilderSideBar(props) {
    const [moleculeResp, setMoleculeResp] = useState(null);
    const [enzymeResp, setEnzymeResp] = useState(null);
    const [moleculeSelection, setMolSelection] = useState(null);
    const [enzymeSelection, setEnzSelection] = useState(null);
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
        // props.onAddMolecule(moleculeResp[selectedMolecule])
        setMolSelection(moleculeResp[selectedMolecule])
    }

    function onMoleculeSubmit() {
        props.onAddMolecule(moleculeSelection)
    }

    function onEnzymeSelect(selectedEnzyme) {
        // props.onAddEnzyme(enzymeResp[selectedEnzyme])
        setEnzSelection(enzymeResp[selectedEnzyme])
    }

    function onEnzymeSubmit() {
        props.onAddEnzyme(enzymeSelection)
    }

  return (
    <div className='card ModelAreaChild' id='PathwaySliderBox'>
            <h1>{props.slidersTitle}</h1>
            <a>{props.slidersDescription}</a>
            <select onChange={(e) => onMoleculeSelect(e.target.value)}>
                <option selected disabled hidden>Select Molecule</option>
                {molecules}
            </select>
            <button onClick={onMoleculeSubmit}>Add Molecule</button>
            <select onChange={(e) => onEnzymeSelect(e.target.value)}>
                <option selected disabled hidden>Select Enzyme</option>
                {enzymes}
            </select>
            <button onClick={onEnzymeSubmit}>Add Enzyme</button>
            <BuildEnzymeModal onNewEnzyme={props.onNewEnzyme} resetDropDowns={setReload} dropDownItems={molecules} moleculeResp={moleculeResp}></BuildEnzymeModal>
            <BuildMoleculeModal onNewMolecule={props.onNewMolecule} resetDropDowns={setReload}></BuildMoleculeModal>
            
        </div>
  );
}

const BuildEnzymeModal = (props) => {
    const [reset, setReset] = useState(false);

    const [name, setName] = useState(null);
    const [abbreviation, setAbbrevation] = useState(null);
    const [substrates, setSubstrates] = useState([]);
    const [products, setProducts] = useState([]);
    const [cofactors, setCofactors] = useState([]);
    const [reversible, setReversible] = useState("false");

    useEffect(() => {
        // clear state for next new enzyme
        setName(null);
        setAbbrevation(null);
        setSubstrates([]);
        setProducts([]);
        setCofactors([]);
        setReversible("false");

        document.getElementById("text1").value="";
        document.getElementById("text2").value="";
        document.getElementById("text3").value="";
    }, [reset])

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
            "cofactors": cofactors
        }
        postEnzyme(enzymeObj);

        props.resetDropDowns(true);

        setReset(!reset)
    }

    function handleNewSubstrate(selectedSubstrate) { // adds new selected molecule to substrate list
        setSubstrates(substrates => [...substrates,props.moleculeResp[selectedSubstrate].id] )
    }

    function handleNewProduct(selectedProduct) { // adds new selected molecule to substrate list
        setProducts(products => [...products,props.moleculeResp[selectedProduct].id] )
    }

    function handleNewCofactor(selectedCofactor) { // adds new selected molecule to substrate list
        setCofactors(cofactors => [...cofactors,props.moleculeResp[selectedCofactor].id] )
    }

    return (
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                New Enzyme
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li>
                    <button onClick={handleClick}>Submit New Enzyme</button>
                    <label>
                    Enzyme Name
                    <input id="text1" type="text" onChange={e => setName(e.target.value)} />
                    </label>
                    <label>
                    Enzyme Abbreviation
                    <input id="text2" type="text" onChange={e => setAbbrevation(e.target.value)} />
                    </label>
                    <label>
                    Reversible
                    <input id="text3" type="text" onChange={e => setReversible(e.target.value)} />
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
                    </ul>
                </li>
                <li class="dropdown-submenu">
                    <a class="dropdown-item" href="#">
                        Products
                    </a>
                    <ul class="dropdown-menu dropdown-submenu">
                        
                        <li>
                            <select onChange={(e) => handleNewProduct(e.target.value)}>
                                <option>Select Products</option>
                                {props.dropDownItems}
                            </select>
                        </li>
                    </ul>
                </li>
                <li class="dropdown-submenu">
                    <a class="dropdown-item" href="#">
                        Cofactors
                    </a>
                    <ul class="dropdown-menu dropdown-submenu">
                        <li>
                            <select class="form-selecton" Change={(e) => handleNewCofactor(e.target.value)}>
                                <option>Select Cofactors</option>
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
    const [reset, setReset] = useState(false);
    const [label, setLabel] = useState(null);
    const [abbr, setAbbr] = useState(null);

    useEffect(() => {
        // clear state for next new molecule
        setLabel(null);
        setAbbr(null);

        document.getElementById("mtext1").value="";
        document.getElementById("mtext2").value="";
    }, [reset])

    function handleSubmit(event) {

        const moleculeObj = {
            "name": label,
            "abbreviation": abbr,
            "ball_and_stick_image": null,
            "space_filling_image": null,
            "link": null,
            "public": true,
            "author": 1
        }
        postMolecule(moleculeObj);

        props.resetDropDowns(true);

        setReset(!reset);
    }

    return (
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                New Molecule
            </button>
              <ul className="dropdown-menu">
                <li>
                    <button onClick={handleSubmit}>Submit New Molecule</button>
                    <label>
                    Molecule Name
                    <input id="mtext1" type="text" onChange={e => setLabel(e.target.value)} />
                    </label>
                    <label>
                    Molecule Abbreviation
                    <input id="mtext2" type="text" onChange={e => setAbbr(e.target.value)} />
                    </label>
                </li>
              </ul>
        </div>
    );
}

export default BuilderSideBar;