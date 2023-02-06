import React, {useContext, useEffect, useState } from 'react'

import './css/NavBar.css';
import "./css/stylesheet.css";

// import requests lib 
import { Link } from 'react-router-dom';

// import modals
import PathwayLoaderModal from './modals/PathwayLoaderModal';
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
        <Link className="navbar-brand" to="/">BioPath</Link>
        
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            
            {/* My Work */}
            { user && 
            <li className="nav-item dropdown">
              <Link className="nav-link" to={"user/" + user.username} role="button">
                My Work
              </Link>
            </li> }

            {/* Explore button */}
            <li className="nav-item">
              <Link className="nav-link" to="explore">
                Explore
              </Link>
            </li>

            {/* help button */}
            <li className="nav-item">
              <Link className="nav-link" to="help">
                Help
              </Link>
            </li>
          </ul>

          {/* User Link */}
          <UserSignInNavBarItem/>

        </div>
      </div>


      {/* Define Modals Accessable from navbar*/}
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
          <ul className="dropdown-menu">
            <li><Link className="dropdown-item" to="/">Settings</Link></li>
            <li><Link className="dropdown-item" to="/" data-bs-toggle="dropdown" onClick={() => setUser(null)}>Sign Out</Link></li>
          </ul>
        </div>
      }
    </div>
  );
}




export default Navbar;