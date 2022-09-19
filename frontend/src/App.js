import React from 'react';
import './App.css';
import Model from "./Component/Model/Model"
import background from "./images/bg-01.png"


const enteredName = "glycolysis";


export default function App() {

  return (
    <div id = "appcontainer">
      <div style={{ backgroundImage: `url(${background})` }}>
      <div className = "mainStructure">
        <Model name = {enteredName} numComplete = '3'/>
      </div>

      </div>

      <div className="modalForLastWeek">

      </div>
    </div>

  );
}