import React, {useContext, useEffect, useState } from 'react'

import './css/NavBar.css';
import "./css/stylesheet.css";

// import requests lib 
import { Link } from 'react-router-dom';

// import modals
import PathwayLoaderModal from './modals/PathwayLoaderModal';
import HelpModal from './modals/HelpModal';
import SignInModal from './modals/SignInModal';
import UserContext from '../UserContext';

/**
 * this is the base component that holds every child component below
 * This component when rendered will be the main navigation bar above 
 * our main model area 
 * @returns website wide navbar component
 */
const Navbar = () => {

  const { user, setUser } = useContext(UserContext);

  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        {/* reset button 
        reset every selectable item, go to base page */}
        <a className="navbar-brand" href="/">BioPath</a>
        
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            
            {/* File Dropdown */}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                File
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Save</a></li>
                <li><a className="dropdown-item" href="#">Save As</a></li>
                <li><hr className="dropdown-divider"/></li>
                <li><a className="dropdown-item" data-bs-toggle="modal" href="#PathwayLoaderModal">Open</a></li>
                <li><a className="dropdown-item" href="#">New</a></li>
                <li><hr className="dropdown-divider"/></li>
                <li><Link className='dropdown-item' to="/">Close</Link></li>
              </ul>
            </li>

            {/* View Dropdown */}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                View
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Model</a></li>
                <li><a className="dropdown-item" href="#">Text</a></li>
              </ul>
            </li>

            {/* help button */}
            <li className="nav-item">
              {/* <button type="button" >Help</button> */}
              <a className="nav-link" href="#helpModal" data-bs-toggle="modal" data-bs-target="#helpModal">
                Help
              </a>
            </li>
          </ul>

          {/* User Link */}
          <UserSignInNavBarItem/>

        </div>
      </div>


      {/* Define Modals Accessable from navbar - this may not be best practice but I dont care :) */}
      <HelpModal/>
      <SignInModal/>
    </nav>
  );
}

/**
 * This component will be displayed on the far right of the navbar 
 * if the user is signed in 
 * Note: upon opening the site, prompt the user using the SignInModal
 * @returns Sign in card component
 */
const UserSignInNavBarItem = () => {
  const { user, setUser } = useContext(UserContext);
  console.log("user info " + JSON.stringify(user))

  // const handleSignedIn

  return (
    <div>
      { !user ? <div className='card'>
          <button className="btn" data-bs-toggle="modal" data-bs-target="#signInModal">
            Sign In
          </button>
        </div>
        : <div className='dropdown dropstart'>
          <button id='signedInCircleButton' className='btn' data-bs-toggle="dropdown" onClick={null}>
            <span>{user.username[0].toUpperCase()}</span>
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Settings</a></li>
            <li><a class="dropdown-item" href="#" onClick={() => setUser(null)}>Sign Out</a></li>
          </ul>
        </div>
      }
    </div>
  );
}




export default Navbar;