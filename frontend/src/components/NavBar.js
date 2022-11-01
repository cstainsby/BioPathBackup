import React, { Component, useState } from 'react'
import './NavBar.css';

// import logos 
import fileLogo from './../icons/folder.png';
import viewLogo from './../icons/search.png';
import helpLogo from './../icons/information.png';
import userLogo from './../icons/user.png';


// ----------------------------------------------------------------------
// Navbar
//  this is the base component that holds every child component below
//  This component when rendered will be the main navigation bar above 
//    our main model area 
// ----------------------------------------------------------------------
export default class NavBar extends Component {

  render() {
    return (
      <div className='NavBar'>
        <NavItem name='File' icon={ fileLogo } />
        <NavItem name='View' icon={ viewLogo } />
        <NavItem name='Help' icon={ helpLogo } />
        <NavItem name='User' icon={ userLogo } />
      </div>
    )
  }
}

// ----------------------------------------------------------------------
// NavItem
//  This component when rendered will be the clickable buttons inside 
//    the navbar 
// ----------------------------------------------------------------------
class NavItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false // initially set the NavItem to unopened 
    };
  }

  handleClick() {
    // set the isOpen state to true 
    this.state.isOpen = !this.state.isOpen;
  }

  render() {
    return (
      <li className='navItem'>
        <a href='#' className='iconButton' onClick={this.handleClick}>
          {this.props.name}
          {this.props.icon}
        </a>

        {/* if the button is clicked */}
        {this.state.isOpen && this.props.displayItems}
      </li>
    );
  }
}

// ----------------------------------------------------------------------
// DropdownMenu
//  This component when rendered will be the menu which will hold all
//    links associated with the NavItem
// ----------------------------------------------------------------------
class DropdownMenu extends Component {
  render() {
    return (
      <div className='dropdownMenu'>
        <DropdownItem></DropdownItem>
      </div>
    );
  }
}

// ----------------------------------------------------------------------
// DropdownItem
//  This component when rendered will be the "sub-items" that are 
//    children to each of the navItems, for example view will have 
//    DropdownItems of "detailed view" and "base view"
// ----------------------------------------------------------------------
class DropdownItem extends Component {

  render() {
    return (
      <a href='#' className='dropdownItem'>
        <span className='leftIcon'>{ this.props.leftIcon }</span>
        {this.props.displayItems}
      </a>
    );
  }
}