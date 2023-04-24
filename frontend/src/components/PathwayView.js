import React, { useState } from 'react';
import FlowModel from './FlowModel';
import ConcentrationManager from './utils/ConcentrationManager';
import { useLoaderData } from 'react-router-dom';

/**
 * @prop {int} pathwayId
 * @returns A react component containing the
 */
function PathwayView() {
    const pathway = useLoaderData();
    let [concentrationManager, _] = useState(new ConcentrationManager());

    return (
        <div className="h-100">
            <FlowModel
                concentrationManager={concentrationManager}
                pathway={pathway}
            />
        </div>
    );
}

export default PathwayView;
