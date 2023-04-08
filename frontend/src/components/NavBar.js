import React, {useContext, useEffect, useState } from 'react'

// import requests lib 
import { Link } from 'react-router-dom';

// import modals
import SignInModal from './modals/SignInModal';
import UserContext from '../UserContext';

import { clearUser } from "../localStoreAccess/userAccess"
import { clearTokens } from "../localStoreAccess/jwtAccess"

/**
 * this is the base component that holds every child component below
 * This component when rendered will be the main navigation bar above 
 * our main model area 
 * @returns website wide navbar component
 */
const Navbar = () => {
    let { user, setUser } = useContext(UserContext);

    function signOut() {
        console.log("Signing out...");
        setUser(null);
        clearTokens();
        clearUser();
    }

    let userSignInIcon;
    if (user) {
        userSignInIcon = 
        <div className='dropdown dropstart'>
            <button type="button" className='btn btn-primary text-center p-2' data-bs-toggle="dropdown">
                <span>{user.username[0].toUpperCase()}</span>
            </button>
            <ul className="dropdown-menu text-center">
                <li><Link className="dropdown-item" to="/">Settings</Link></li>
                <li><Link className="dropdown-item" to="/" data-bs-toggle="dropdown" onClick={signOut}>Sign Out</Link></li>
            </ul>
        </div>
    } else {
        userSignInIcon = 
        <div className='card'>
            {/* Define Modals Accessable from navbar*/}
            <SignInModal/>
            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#signInModal">
                Sign In
            </button>
        </div>
    }

    return (
        <nav className="navbar navbar-expand-md border-bottom border-4 border-secondary">
            <div className="container-fluid">
            <Link className="navbar-brand fw-bold px-3" to="/">BioPath</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ms-auto">
                    {/* "My Work" only shows when user is signed in */}
                    { user && 
                    <li className="nav-item">
                        <Link className="nav-link" to={"user/" + user.username} role="button">
                            My Work
                        </Link>
                    </li> }

                    {/* Explore button */}
                    {/* <li className="nav-item">
                    <Link className="nav-link" to="explore">
                        Explore
                    </Link>
                    </li> */}

                    {/* help button */}
                    <li className="nav-item">
                        <Link className="nav-link" to="help">
                            Help
                        </Link>
                    </li>
                    {/* User Link */}
                    <li className="nav-item mx-2">
                        {userSignInIcon}
                    </li>
                </ul>
            </div>
            </div>
        </nav>
    );
}

export default Navbar;