import React, { Component, useState } from 'react'
import './NavBar.css';

// import logos 
import fileLogo from './../icons/folder.png';
import viewLogo from './../icons/search.png';
import helpLogo from './../icons/information.png';
import userLogo from './../icons/user.png';
import dropdownLogo from './../icons/arrow-down-sign-to-navigate.png';
import finger from "../icons/hand.png";


// ----------------------------------------------------------------------
// Navbar
//  this is the base component that holds every child component below
//  This component when rendered will be the main navigation bar above 
//    our main model area 
// ----------------------------------------------------------------------
export default class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // define openStates for each of the buttons as a dictionary
      navItemOpenStatusDict: {
        "File": false,
        "View": false,
        "User": false
      }
    }

    this.signalChange = this.signalChange.bind(this);
  }

  // this function will, given the new status for a child is true, 
  //    change all other children isOpen to false 
  signalChange(name, newIsOpenStatus) {
    let currNavOpenDict = this.state.navItemOpenStatusDict;

    let newNavItemOpenStatusDict = currNavOpenDict;

    // for each of the keys not changed, if they are set to open, they need to be closed
    for(let [key, value] of Object.entries(currNavOpenDict)) {
      if(key !== name && value === true) {
        // change all other keys to false if clicked button is expanded 
        newNavItemOpenStatusDict[key] = false;
      } 
      else if(key === name) {
        // change the clicked key regardless
        newNavItemOpenStatusDict[key] = newIsOpenStatus;
      }

      this.setState({
        navItemOpenStatusDict: newNavItemOpenStatusDict
      });
    }
    console.log(
      "In signalChange(): \n" +
      "   New nav dict status for " + name + ": " + this.state.navItemOpenStatusDict[name]);
    
  }

  // this render function holds the main html structure for the entire navbar 
  render() {
    return (
      <nav class="navbar navbar-expand-lg bg-light">
        <div class="container-fluid">
          {/* reset button 
          reset every selectable item, go to base page */}
          <a className="navbar-brand" href="#">Biopath</a>
          
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              {/* File Dropdown */}
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src={fileLogo} alt="Logo" width="30" height="24" className='d-inline-block align-text-top'/>
                  File
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Save</a></li>
                  <li><a class="dropdown-item" href="#">Save As</a></li>
                  <li><a class="dropdown-item" href="#">Load</a></li>
                  <li><a class="dropdown-item" href="#">New</a></li>
                  <li><a class="dropdown-item" href="#">Delete</a></li>
                </ul>
              </li>

              {/* View Dropdown */}
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img src={viewLogo} alt="Logo" width="30" height="24" className='d-inline-block align-text-top'/>
                  View
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Model</a></li>
                  <li><a class="dropdown-item" href="#">Text</a></li>
                </ul>
              </li>

              {/* help button */}
              <li class="nav-item">
                {/* <button type="button" >Help</button> */}
                <a class="nav-link" href="#helpModal" data-bs-toggle="modal" data-bs-target="#helpModal">
                <img src={helpLogo} alt="Logo" width="30" height="24" className='d-inline-block align-text-top'/>
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
    )
  }
}


// ----------------------------------------------------------------------
// UserSignInNavBarItem
//  This component will be displayed on the far right of the navbar 
//    if the user is signed in 

// Note: upon opening the site, prompt the user using the SignInModal
// ----------------------------------------------------------------------
class UserSignInNavBarItem extends Component {
  constructor(props) {
    super(props);

    // check if the user is signed in 

    this.state = {
      signedIn : false
    }
  }

  render() {

    if(this.state.signedIn) {

      return (
        <></>
      );
    }
    else {
      //
      return (
        <div className='card'>
          <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#signInModal">
            <img src={userLogo} alt="Logo" width="30" height="24"/>
            Sign In
          </button>
        </div>
      );
    }
  }
}

// ----------------------------------------------------------------------
// SignInModal
// ----------------------------------------------------------------------
class SignInModal extends Component {
  constructor(props) {
    super(props);
    
  }

  render() {
    return (
      <div class="modal fade" id="signInModal" tabindex="-1" aria-labelledby="signInModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="signInModalLabel">Sign In</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              Put Oath or some other sign in method here
              
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Skip</button>
              <button type="button" class="btn btn-primary">Sign In</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


// ----------------------------------------------------------------------
// HelpModal
// ----------------------------------------------------------------------
class HelpModal extends Component {
  constructor(props) {
    super(props);
    
  }

  render() {
    return (
      <div class="modal fade" id="helpModal" tabindex="-1" aria-labelledby="helpModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Help Not Implemented</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <h3>Help Yourself</h3>
              <img src={finger}></img>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Welp...</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
