import React, { Component, useState } from 'react'
import './css/NavBar.css';

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
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          {/* reset button 
          reset every selectable item, go to base page */}
          <a className="navbar-brand" href="/">Biopath</a>
          
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
                  <li><a className="dropdown-item" data-bs-toggle="modal" href="#loadPathwayModal">Open</a></li>
                  <li><a className="dropdown-item" href="#">New</a></li>
                  <li><a className="dropdown-item" href="#">Delete</a></li>
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
        <LoadPathwayModal dataObserver={ this.props.dataObserver }/>
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
          <button className="btn" data-bs-toggle="modal" data-bs-target="#signInModal">
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
      <div className="modal fade" id="signInModal" tabIndex="-1" aria-labelledby="signInModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="signInModalLabel">Sign In</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Put Oath or some other sign in method here
              
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Skip</button>
              <button type="button" className="btn btn-primary">Sign In</button>
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
      <div className="modal fade" id="helpModal" tabIndex="-1" aria-labelledby="helpModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="helpModalLabel">Help Not Implemented</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <h3>Help Yourself</h3>
              <img src={finger}></img>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Welp...</button>
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

    this.eventTypeId = "loadPathway";

    this.state = {
      pathways: []
    }

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


  onPathwaySelected = (pathwayId) => {
    console.log("load pathway button selected: " + pathwayId)
    getPathwayById(pathwayId)
    .then(data => {
      this.props.dataObserver.postEvent(this.eventTypeId, data);
    });
  }

  buildPathwayCardsList() {
    // helper function which dynamically builds cards list containing each pathway for the user to choose from
    // NOTE the json Data should be in a list
    let pathwayListHtml = this.state.pathways.map((pathway) => {
      return (
        <li id='loadPathwayListItem'>
          <div className="card">
            <div className="card-body">
              <div className="container text-center">
                <div className="row">
                  <div className="col-8">
                    <h3 className='loadPathwayListTitle'>{ pathway.name }</h3>
                    <p>Created By { pathway.author } </p>
                  </div>
                  <div className="col-2" id=''>
                    <button 
                      type="button" 
                      className="btn btn-primary" 
                      data-bs-dismiss="modal" 
                      onClick={ (e) => this.onPathwaySelected(pathway.id, e) 
                      }>Load</button>
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
      <div className="modal fade" id="loadPathwayModal" tabIndex="-1" aria-labelledby="loadPathwayModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="loadPathwayModalLabel">Load In Pathway</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
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