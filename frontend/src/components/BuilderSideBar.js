import React, {useContext, useState, useEffect} from "react";

import { getEnzymes, getMolecules, postMolecule, postEnzyme } from '../requestLib/apiRequests';

import '../scss/BuilderSideBar.scss'

function BuilderSideBar(props) {
    const [moleculeResp, setMoleculeResp] = useState(null);
    const [enzymeResp, setEnzymeResp] = useState(null);
    const [moleculeSelection, setMolSelection] = useState(null);
    const [enzymeSelection, setEnzSelection] = useState(null);
    const [enzymes, setEnzymes] = useState();
    const [molecules, setMolecules] = useState();
    const [reload, setReload] = useState(true); // used to call db when new stuff posted

    const onDragStart = (event, nodeType) => { // testing
        if (nodeType === 'molecule') {
            var nodeJSON = JSON.stringify(props.onAddMolecule(moleculeSelection));
        }
        else { // enzyme
            var nodeJSON = JSON.stringify(props.onAddEnzyme(enzymeSelection));
        }

        event.dataTransfer.setData('application/reactflow', nodeJSON);
        event.dataTransfer.effectAllowed = 'move';
    };
    
    useEffect(() => { 
        // anytime moleculeResp, enzymeResp, or reload state changes, rerender the lists
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
        setMolSelection(moleculeResp[selectedMolecule])
    }

    function onMoleculeSubmit() {
        props.onAddMolecule(moleculeSelection)
    }

    function onEnzymeSelect(selectedEnzyme) {
        setEnzSelection(enzymeResp[selectedEnzyme])
    }

    function onEnzymeSubmit() {
        props.onAddEnzyme(enzymeSelection)
    }

  return (
    <div className='card ModelAreaChild' id='PathwaySliderBox'>
            <h1>{props.slidersTitle}</h1>
            <a>{props.slidersDescription}</a>
            <select class="form-select" onChange={(e) => onMoleculeSelect(e.target.value)}>
                <option selected disabled hidden>Select Molecule</option>
                {molecules}
            </select>
            {/* <button class="btn btn-primary" onClick={onMoleculeSubmit}>Add Molecule</button> */}
            <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'molecule')} draggable>
                <button class="btn btn-primary" onClick={onMoleculeSubmit}>Add Molecule</button>
            </div>
            <select class="form-select" onChange={(e) => onEnzymeSelect(e.target.value)}>
                <option selected disabled hidden>Select Enzyme</option>
                {enzymes}
            </select>
            {/* <button class="btn btn-primary" onClick={onEnzymeSubmit}>Add Enzyme</button> */}
            <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'enzyme')} draggable>
                <button class="btn btn-primary" onClick={onMoleculeSubmit}>Add Enzyme</button>
            </div>
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

        document.getElementById("enzymeName").value="";
        document.getElementById("enzymeAbbr").value="";
        document.getElementById("substrates").selectedIndex=-1;
        document.getElementById("products").selectedIndex=-1;
        document.getElementById("cofactors").selectedIndex=-1;
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
        // setSubstrates(substrates => [...substrates,props.moleculeResp[selectedSubstrate].id] )
        let selectElement = document.getElementById("substrates");
        // get the molecule id from the value of each selected option
        let selectedValues = Array.from(selectElement.selectedOptions)
            .map(option => (props.moleculeResp[parseInt(option.value)].id));
        setSubstrates(selectedValues);
    }

    function handleNewProduct(selectedProduct) { // adds new selected molecule to substrate list
        // setProducts(products => [...products,props.moleculeResp[selectedProduct].id] )
        let selectElement = document.getElementById("products");
        // get the molecule id from the value of each selected option
        let selectedValues = Array.from(selectElement.selectedOptions)
            .map(option => (props.moleculeResp[parseInt(option.value)].id));
        setProducts(selectedValues);
    }

    function handleNewCofactor(selectedCofactor) { // adds new selected molecule to substrate list
        // setCofactors(cofactors => [...cofactors,props.moleculeResp[selectedCofactor].id] )
        let selectElement = document.getElementById("cofactors");
        // get the molecule id from the value of each selected option
        let selectedValues = Array.from(selectElement.selectedOptions)
            .map(option => (props.moleculeResp[parseInt(option.value)].id));
        setCofactors(selectedValues);
    }

    return (
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                New Enzyme
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li>
                    <button class="btn btn-primary" onClick={handleClick}>Submit New Enzyme</button>
                    <label>
                    Enzyme Name
                    <input id="enzymeName" class="form-control" type="text" onChange={e => setName(e.target.value)} />
                    </label>
                    <label>
                    Enzyme Abbreviation
                    <input id="enzymeAbbr" class="form-control" type="text" onChange={e => setAbbrevation(e.target.value)} />
                    </label>
                    <label>
                    Reversible
                    <select class="form-select" onChange={e => setReversible(e.target.value)}>
                        <option>false</option>
                        <option>true</option>
                    </select>
                    </label>
                </li>
                <li class="dropdown-submenu">
                    <a class="dropdown-item" href="#">
                        Substrates
                    </a>
                    <ul class="dropdown-menu dropdown-submenu">
                        <li>
                            <select id="substrates" class="form-select" onChange={(e) => handleNewSubstrate(e.target.value)} multiple>
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
                            <select id="products" class="form-select" onChange={(e) => handleNewProduct(e.target.value)} multiple>
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
                            <select id="cofactors" class="form-select" Change={(e) => handleNewCofactor(e.target.value)} multiple>
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

        document.getElementById("mName").value="";
        document.getElementById("mAbbr").value="";
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
                    <button class="btn btn-primary" onClick={handleSubmit}>Submit New Molecule</button>
                    <label>
                        Molecule Name
                    <input id="mName" class="form-control" type="text" onChange={e => setLabel(e.target.value)} />
                    </label>
                    <label>
                        Molecule Abbreviation
                    <input id="mAbbr" class="form-control" type="text" onChange={e => setAbbr(e.target.value)} />
                    </label>
                </li>
              </ul>
        </div>
    );
}

export default BuilderSideBar;