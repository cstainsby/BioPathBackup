import './scss/App.scss'
import React from 'react'; 

import RouteManager from './components/RouteManager';

function App() {
    return (
        <div className="text-center justify-content-center vh-100 vw-100">
            <RouteManager />
        </div>
    );
}

export default App;