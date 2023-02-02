import React, { Component, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import FlowModel from './reactFlowComponents/FlowModel'
import NavBar from './NavBar'
import ErrorPage from './pages/ErrorPage';

//import Restore from './Restore';
import './css/PathwayView.css'

import ConcentrationManager from './utils/ConcentrationManager';


/**
 * 
 * @prop {int} pathwayId 
 * @returns A react component containing the 
 */
const PathwayView = (props) => {
  let [concentrationManager, setConcentrationManager] = useState(new ConcentrationManager());

  return (
    <div className="container-fluid" id='MainView'>

      {/* the pathway view, left, and right sidebar divs are going to 
          be held in columns
      */}
      <div className="row" id="PathwayViewRow">
        <div className="col" id="ModelAreaCol">
          <FlowModel 
            concentrationManager = {concentrationManager}
          />
          
        </div>
      </div>
    </div>
  );
}


// Possible entrypoints to find pathway
// 1. your most recent pathways
// 2. class pathways 
// 3. highest rated pathways from community 
// 4. 
const NavagationCard = () => {


  return (
    <div class="card w-50">
      <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <a href="#" class="btn btn-primary">Button</a>
      </div>
    </div>
  )
}

// export default class PathwayView extends Component {
//   constructor(props) {
//     super(props);

//     this.concentrationManager = new ConcentrationManager();
//   }

//   render() {

//     return (
//       <div className="container-fluid" id='MainView'>

//         {/* the pathway view, left, and right sidebar divs are going to 
//             be held in columns
//         */}
//         <div className="row" id="PathwayViewRow">
//           <div className="col" id="ModelAreaCol">
//             <FlowModel 
//               concentrationManager= {this.concentrationManager}
//             />
            
//           </div>
//         </div>
//       </div>
//     )
//   }
// }

export default PathwayView;