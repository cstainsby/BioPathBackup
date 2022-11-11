import './App.css';
import React, { Component }  from 'react'; // added this for an error meesage
import PathwayView from './views/PathwayView';

function App() {
  return (
    <div className="App">
      {/* Top navigation bar needed for all activities */}
      
      {/* The main View which should hold everything else */}
      <PathwayView/>
    </div>
  );
}

export default App;