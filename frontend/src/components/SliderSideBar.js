import React, { useEffect, useState } from 'react'

import dropdownLogo from "../icons/arrow-down-sign-to-navigate.png";

/**
 * Display and control concentration of pathway cofactors
 * @param props
 * @prop {Object[]} molecules
 * @prop molecules[].title
 * @prop molecules[].value
 * @prop handleConcentrationChange(string, int): void
 */
const SliderSideBar = (props) => {
    return (
        <div className='card' style={{zIndex: '5'}}>
            <button className="btn btn-primary m-1" onClick={() => {props.run()}} disabled={props.running}>
                Run
            </button>
            <button className="btn btn-secondary m-1" onClick={() => {props.stop()}} disabled={!props.running}>
                Stop
            </button>
            <button className="btn btn-secondary m-1" onClick={() => {props.reset()}}>
                Reset
            </button>
            <div className='fs-4'>Concentrations</div>
            <div className='fs-6 px-3'><small className="text-muted">Adjust molecule concentrations</small></div>
            <div className='container p-2' style={{maxHeight: "50vh", overflowY: "auto"}}>
                {Object.entries(props.molecules).map(([id, data]) => 
                    <div className="row m-2" key={id}>
                        <Slider 
                            id={id}
                            title={data.title}
                            value={data.value.toFixed(2)}
                            handleConcentrationChange={props.handleConcentrationChange} 
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

/**
 * Named slider selector
 * @prop id - id of substrate
 * @prop title - title of the substrate passed in
 * @prop value
 * @prop handleConcentrationChange 
 */
const Slider = (props) => {
    let [isExpanded, setIsExpanded] = useState(false);

    const handleSliderValueChange = (newSliderValue) => {
        props.handleConcentrationChange(props.id, newSliderValue);
    }

    const handleClick = (e) => {
        setIsExpanded(!isExpanded);
    }

    const openHeader = 
        <button className='btn d-flex flex-row align-items-center' onClick={(e) => handleClick(e.target.value)}>
            <img src={dropdownLogo} style={{ maxHeight: "12px"}}/>
            <div className='fs-4 fw-bold mx-3'>{props.title}</div>
        </button>

    const closeHeader = 
        <button className='btn d-flex flex-row align-items-center' onClick={(e) => handleClick(e.target.value)}>
            <img src={dropdownLogo} style={{ transform: "rotate(-90deg)", maxHeight: "12px"}}  />
            <div className='fs-4 mx-3'>{props.title}</div>
            <div className="fs-6 text-muted">{ parseFloat(props.value * 100).toFixed(0) }%</div>
        </button>

    const cardContents = 
        <div className='card-body sliderCardContents'>
            <input 
                type="range"
                min={0.0}
                step={0.1}
                max={2.0}
                onChange={(e) => handleSliderValueChange(e.target.value)}
                value={props.value}
            />
            <p className='card-text'>{parseInt(props.value * 100)}% of concentration</p> {/* parseInt because 110% was giving a long float */}
        </div>
        

    return (
        <div className='card scaleOnHover' id='sliderCard'>
            { isExpanded ? openHeader : closeHeader}
            { isExpanded ? cardContents : null }
        </div>
    )

}

export default SliderSideBar;