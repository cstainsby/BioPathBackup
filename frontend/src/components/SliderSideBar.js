import React, { useState } from 'react';

import dropdownLogo from '../icons/arrow-down-sign-to-navigate.png';

/**
 * Display and control concentration of pathway cofactors
 * @prop {Object[]} molecules
 * @prop molecules[].title
 * @prop molecules[].value
 * @prop run(): void
 * @prop stop(): void
 * @prop reset(): void
 * @prop {boolean} running
 * @prop handleConcentrationChange(string, int): void
 */
const SliderSideBar = ({
    run,
    stop,
    reset,
    running,
    molecules,
    handleConcentrationChange,
}) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleExpanded = () => {
        setIsExpanded((expanded) => !expanded);
    };

    return (
        <>
            <div className="card bg-opacity-10" style={{ zIndex: '5' }}>
                <button
                    className="btn btn-primary"
                    type="button"
                    onClick={toggleExpanded}
                >
                    {isExpanded ? 'Hide Concentrations' : 'Show Concentrations'}
                </button>
            </div>
            <div
                className={'card collapse' + (isExpanded ? ' show' : '')}
                style={{ zIndex: '5' }}
            >
                <div className="container-fluid px-0">
                    <button
                        className="btn btn-primary col-6"
                        onClick={() => {
                            run();
                        }}
                        disabled={running}
                    >
                        Run
                    </button>
                    <button
                        className="btn btn-secondary col-6"
                        onClick={() => {
                            stop();
                        }}
                        disabled={!running}
                    >
                        Stop
                    </button>
                </div>
                <button
                    className="btn btn-secondary col-12"
                    onClick={() => {
                        reset();
                    }}
                >
                    Reset
                </button>
                <div className="fs-5">Concentrations</div>
                <div className="fs-6 px-3">
                    <small className="text-muted">Adjust concentrations</small>
                </div>
                <div
                    className="container p-0"
                    style={{ maxHeight: '50vh', overflowY: 'auto' }}
                >
                    {Object.entries(molecules).map(([id, data]) => (
                        <div className="row m-2" key={id}>
                            <Slider
                                id={id}
                                title={data.title}
                                value={data.value.toFixed(2)}
                                handleConcentrationChange={
                                    handleConcentrationChange
                                }
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

/**
 * Named slider selector
 * @prop id - id of substrate
 * @prop title - title of the substrate passed in
 * @prop value
 * @prop handleConcentrationChange
 */
const Slider = ({ title, value, id, handleConcentrationChange }) => {
    let [isExpanded, setIsExpanded] = useState(false);

    const handleSliderValueChange = (newSliderValue) => {
        handleConcentrationChange(id, newSliderValue);
    };

    const handleClick = (e) => {
        setIsExpanded(!isExpanded);
    };

    const openHeader = (
        <div
            className="btn d-flex flex-row align-items-center"
            onClick={(e) => handleClick(e.target.value)}
        >
            <img src={dropdownLogo} style={{ maxHeight: '16px' }} />
            <div className="fs-4 fw-bold mx-3">{title}</div>
        </div>
    );

    const closeHeader = (
        <div
            className="btn d-flex flex-row align-items-center"
            onClick={(e) => handleClick(e.target.value)}
        >
            <img
                src={dropdownLogo}
                style={{ transform: 'rotate(-90deg)', maxHeight: '16px' }}
            />
            <div className="fs-4 mx-3">{title}</div>
            <div className="fs-6 text-muted">
                {parseFloat(value * 100).toFixed(0)}%
            </div>
        </div>
    );

    const cardContents = (
        <div className="card-body sliderCardContents">
            <input
                type="range"
                min={0.0}
                step={0.1}
                max={2.0}
                onChange={(e) => handleSliderValueChange(e.target.value)}
                value={value}
            />
            <p className="card-text">
                {parseInt(value * 100)}% of concentration
            </p>{' '}
            {/* parseInt because 110% was giving a long float */}
        </div>
    );

    return (
        <div className="card p-0" id="sliderCard">
            {isExpanded ? openHeader : closeHeader}
            {isExpanded ? cardContents : null}
        </div>
    );
};

export default SliderSideBar;
