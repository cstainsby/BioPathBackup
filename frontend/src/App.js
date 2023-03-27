import './scss/App.scss'
import React from 'react'; 

import RouteManager from './components/RouteManager';

function App() {
    return (
        <div className="d-flex w-100 text-center justify-content-center">
            <RouteManager />
        </div>
    );
}

export default App;