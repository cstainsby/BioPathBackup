import React, { Component, useState, useEffect } from 'react'
import FlowModel from './FlowModel'
import ConcentrationManager from './utils/ConcentrationManager';
import { useLoaderData } from 'react-router-dom';

/**
 * 
 * @prop {int} pathwayId 
 * @returns A react component containing the 
 */
const PathwayView = (props) => {
    const pathway = useLoaderData();
    const [isMinimized, setIsMinimized] = useState(false);
    let [concentrationManager, setConcentrationManager] = useState(new ConcentrationManager());

    return (
        <div className='h-100'>
            <FlowModel 
                concentrationManager={concentrationManager}
                pathway={pathway}
            />
        </div>
    );
}

export default PathwayView;