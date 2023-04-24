import React, { useContext, useState, useEffect } from "react";

import {
    getEnzymes,
    getMolecules,
    postMolecule,
    postEnzyme,
} from "../requestLib/apiRequests";

import Tooltip from "./Tooltip";
import CheckboxList from "./CheckboxList";
import Modal from "react-bootstrap/Modal";

import Button from "react-bootstrap/Button";
import FilteredSelect from "./FilterSelect";

function BuilderSideBar(props) {
    const [moleculeResp, setMoleculeResp] = useState([]);
    const [enzymeResp, setEnzymeResp] = useState([]);
    const [moleculeSelection, setMolSelection] = useState(null);
    const [enzymeSelection, setEnzSelection] = useState(null);
    const [enzymes, setEnzymes] = useState();
    const [molecules, setMolecules] = useState();
    const [reload, setReload] = useState(true); // used to call db when new stuff posted
    const [moleculeShow, setMoleculeShow] = useState(false); // used for displaying modal
    const [enzymeShow, setEnzymeShow] = useState(false); // used for displaying modal

    // needed to prevent an infinite rerender
    const handleMoleculeClose = () => setMoleculeShow(false);
    const handleMoleculeShow = () => setMoleculeShow(true);
    const handleEnzymeClose = () => setEnzymeShow(false);
    const handleEnzymeShow = () => setEnzymeShow(true);

    const onDragStart = (event, nodeType) => {
        if (nodeType === "molecule build") {
            var nodeJSON = JSON.stringify(
                props.onAddMolecule(moleculeSelection)
            );
        } else {
            // enzyme
            var nodeJSON = JSON.stringify(props.onAddEnzyme(enzymeSelection));
        }

        event.dataTransfer.setData("application/reactflow", nodeJSON);
        event.dataTransfer.effectAllowed = "move";
    };

    useEffect(() => {
        // anytime moleculeResp, enzymeResp, or reload state changes, rerender the lists
        if (moleculeResp != []) {
            const dropDownItems = moleculeResp.map((item, index) => (
                <option value={index}>{item["name"]}</option>
            ));
            setMolecules(dropDownItems);
        }
        if (enzymeResp != []) {
            const dropDownItems = enzymeResp.map((item, index) => (
                <option value={index}>{item["name"]}</option>
            ));
            setEnzymes(dropDownItems);
        }
        if (reload) {
            callGetEnzymes();
            callGetMolecules();
        }
    }, [moleculeResp, enzymeResp, reload]);

    function callGetMolecules() {
        setReload(false);
        getMolecules().then((moleculeResp) => setMoleculeResp(moleculeResp));
    }

    function callGetEnzymes() {
        setReload(false);
        getEnzymes().then((enzymeResp) => setEnzymeResp(enzymeResp));
    }

    function onMoleculeSelect(selectedMolecule) {
        setMolSelection(moleculeResp[selectedMolecule]);
    }

    function onEnzymeSelect(selectedEnzyme) {
        setEnzSelection(enzymeResp[selectedEnzyme]);
    }

    return (
        <div
            className="card ModelAreaChild"
            id="PathwaySliderBox"
            style={{ zIndex: "6" }}
        >
            <div className="fs-1">Pathway Builder</div>
            <div className="fs-5">Create a new Pathway</div>
            <div className="container">
                <FilteredSelect
                    options={moleculeResp}
                    selectFunction={onMoleculeSelect}
                    filterType="Molecule"
                />
                <div
                    className="dndnode input"
                    onDragStart={(event) =>
                        onDragStart(event, "molecule build")
                    }
                    draggable
                >
                    <Tooltip text="Drag and Drop">
                        <button className="btn btn-primary">
                            Add Molecule
                        </button>
                    </Tooltip>
                </div>
                <FilteredSelect
                    options={enzymeResp}
                    selectFunction={onEnzymeSelect}
                    filterType="Enzyme"
                />
                <div
                    className="dndnode input"
                    onDragStart={(event) => onDragStart(event, "enzyme build")}
                    draggable
                >
                    <Tooltip text="Drag and Drop">
                        <button className="btn btn-primary">Add Enzyme</button>
                    </Tooltip>
                </div>
                <>
                    <Button variant="secondary" onClick={handleEnzymeShow}>
                        New Enzyme
                    </Button>

                    <Modal show={enzymeShow} onHide={handleEnzymeClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Save New Enzyme</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <BuildEnzymeModal
                                onNewEnzyme={props.onNewEnzyme}
                                resetDropDowns={setReload}
                                moleculeResp={moleculeResp}
                                onSubmit={handleEnzymeClose}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={handleEnzymeClose}
                            >
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
                <>
                    <Button variant="secondary" onClick={handleMoleculeShow}>
                        New Molecule
                    </Button>

                    <Modal show={moleculeShow} onHide={handleMoleculeClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Save New Molecule</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <BuildMoleculeModal
                                onNewMolecule={props.onNewMolecule}
                                resetDropDowns={setReload}
                                onSubmit={handleMoleculeClose}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={handleMoleculeClose}
                            >
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            </div>
        </div>
    );
}

const BuildEnzymeModal = (props) => {
    const [name, setName] = useState(null);
    const [abbreviation, setAbbrevation] = useState(null);
    const [substrates, setSubstrates] = useState([]);
    const [products, setProducts] = useState([]);
    const [cofactors, setCofactors] = useState([]);
    const [reversible, setReversible] = useState("false");

    function handleClick() {
        const enzymeObj = {
            name: name,
            abbreviation: abbreviation,
            reversible: reversible === "true",
            image: null,
            link: null,
            public: true,
            author: 1,
            substrates: substrates,
            products: products,
            cofactors: cofactors,
        };
        postEnzyme(enzymeObj);

        // GET request sometimes executes before POST finishes
        setTimeout(function () {
            props.onSubmit();
            props.resetDropDowns(true);
        }, 1000);
    }

    const handleSubstrateChange = (newSelections) => {
        // get true molecule id from moleculeResp
        let selectedValues = newSelections.map((value, index) => {
            if (value) return props.moleculeResp[index].id;
        });
        setSubstrates(selectedValues);
    };

    const handleProductChange = (newSelections) => {
        let selectedValues = newSelections.map((value, index) => {
            if (value) return props.moleculeResp[index].id;
        });
        setProducts(selectedValues);
    };

    const handleCofactorChange = (newSelections) => {
        let selectedValues = newSelections.map((value, index) => {
            if (value) return props.moleculeResp[index].id;
        });
        setCofactors(selectedValues);
    };

    return (
        <div className="dropdown m-1">
            <ul>
                <li>
                    <label>
                        Enzyme Name
                        <input
                            id="enzymeName"
                            className="form-control"
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                    <label>
                        Enzyme Abbreviation
                        <input
                            id="enzymeAbbr"
                            className="form-control"
                            type="text"
                            onChange={(e) => setAbbrevation(e.target.value)}
                        />
                    </label>
                </li>
                <li>
                    <label>
                        Reversible
                        <select
                            className="form-select"
                            onChange={(e) => setReversible(e.target.value)}
                        >
                            <option>false</option>
                            <option>true</option>
                        </select>
                    </label>
                </li>
                <li>
                    <CheckboxList
                        options={props.moleculeResp}
                        onSelectionChange={handleSubstrateChange}
                        listName="Substrates"
                    />
                </li>
                <li>
                    <CheckboxList
                        options={props.moleculeResp}
                        onSelectionChange={handleProductChange}
                        listName="Products"
                    />
                </li>
                <li>
                    <CheckboxList
                        options={props.moleculeResp}
                        onSelectionChange={handleCofactorChange}
                        listName="Cofactors"
                    />
                </li>
                <li>
                    <button className="btn btn-primary" onClick={handleClick}>
                        Submit New Enzyme
                    </button>
                </li>
            </ul>
        </div>
    );
};

const BuildMoleculeModal = (props) => {
    const [label, setLabel] = useState(null);
    const [abbr, setAbbr] = useState(null);

    function handleSubmit(event) {
        const moleculeObj = {
            name: label,
            abbreviation: abbr,
            ball_and_stick_image: null,
            space_filling_image: null,
            link: null,
            public: true,
            author: 1,
        };
        postMolecule(moleculeObj);

        // setTimeout function because GET Request sometimes executes before POST request finishes
        setTimeout(function () {
            props.onSubmit();
            props.resetDropDowns(true);
        }, 1000);
    }

    return (
        <div className="dropdown m-1">
            <ul>
                <li>
                    <label>
                        Molecule Name
                        <input
                            id="mName"
                            className="form-control"
                            type="text"
                            onChange={(e) => setLabel(e.target.value)}
                        />
                    </label>
                </li>
                <li>
                    <label>
                        Molecule Abbreviation
                        <input
                            id="mAbbr"
                            className="form-control"
                            type="text"
                            onChange={(e) => setAbbr(e.target.value)}
                        />
                    </label>
                </li>
                <li>
                    <button className="btn btn-primary" onClick={handleSubmit}>
                        Submit New Molecule
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default BuilderSideBar;
