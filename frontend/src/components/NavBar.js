import React, { Component, useState } from 'react'
import './NavBar.css';

// import logos 
import fileLogo from './../icons/folder.png';
import viewLogo from './../icons/search.png';
import helpLogo from './../icons/information.png';
import userLogo from './../icons/user.png';
import dropdownLogo from './../icons/arrow-down-sign-to-navigate.png';
import finger from "../icons/hand.png";

// import requests lib 
import { getPathways, getPathwayById } from "../requestLib/requests";


// ----------------------------------------------------------------------
// Navbar
//  this is the base component that holds every child component below
//  This component when rendered will be the main navigation bar above 
//    our main model area 
// ----------------------------------------------------------------------
export default class NavBar extends Component {
  constructor(props) {
    super(props);
  }


  // this render function holds the main html structure for the entire navbar 
  render() {
    return (
      <nav class="navbar navbar-expand-lg bg-light">
        <div class="container-fluid">
          {/* reset button 
          reset every selectable item, go to base page */}
          <a className="navbar-brand" href="/">Biopath</a>
          
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              {/* File Dropdown */}
              <li class="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <img id='navBarFileLogo' src={fileLogo} alt="Logo" width="30" height="24" className='d-inline-block align-text-top'/>
                  File
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Save</a></li>
                  <li><a class="dropdown-item" href="#">Save As</a></li>
                  <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#loadPathwayModal">Load</a></li>
                  <li><a class="dropdown-item" href="#">New</a></li>
                  <li><a class="dropdown-item" href="#">Delete</a></li>
                </ul>
              </li>

              {/* View Dropdown */}
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img id='navBarViewLogo' src={viewLogo} alt="Logo" width="30" height="24" className='d-inline-block align-text-top'/>
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
                  <img id='navBarHelpLogo' src={helpLogo} alt="Logo" width="30" height="24" className='d-inline-block align-text-top'/>
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
        <LoadPathwayModal/>
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
              <h1 class="modal-title fs-5" id="helpModalLabel">Help Not Implemented</h1>
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


// ----------------------------------------------------------------------
// LoadPathwayModal
// ----------------------------------------------------------------------
class LoadPathwayModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pathways: []
    }

    // loadButtonClicked() {
    //   return
    // }

    // get JSON data for pathways
    // including function here will force the modal to re-render
    getPathways()
      .then(data => {
        // read list of pathways into a list for state
        let pathwayList = []
        for(let i = 0; i < data.length; ++i) {
          console.log("at " + i + data[i].name)
          pathwayList.push(data[i]);
        }

        console.log("data in render: " + JSON.stringify(data));

        this.setState({
          pathways: pathwayList
        })
      });
  }

  buildPathwayCardsList() {
    // helper function which dynamically builds cards list containing each pathway for the user to choose from
    // NOTE the json Data should be in a list
    let pathwayListHtml = this.state.pathways.map((pathway) => {
      return (
        <li id='loadPathwayListItem'>
          <div class="card">
            <div class="card-body">
              <div class="container text-center">
                <div class="row">
                  <div class="col-8">
                    <h3 className='loadPathwayListTitle'>{ pathway.name }</h3>
                    <p>Created By { pathway.author } </p>
                  </div>
                  <div class="col-2" id=''>
                    <button type="button" class="btn btn-primary">Load</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>);
    });
    let finalCardListHtml = <ul>{ pathwayListHtml }</ul>;
    
    return finalCardListHtml;
  }

  render() {
    return (
      <div class="modal fade" id="loadPathwayModal" tabindex="-1" aria-labelledby="loadPathwayModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="loadPathwayModalLabel">Load In Pathway</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              { (this.state.pathways.length > 0)                // if there are pathways to display
                ? this.buildPathwayCardsList()                  // display them
                : <h4>Looks like there aren't any pathways</h4> // otherwise send message to user
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}