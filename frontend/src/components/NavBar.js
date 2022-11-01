import React, { Component, useState } from 'react'
import './NavBar.css';


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
        <ul className='left'>
          <NavItem name="File" icon=""/>
          <li><button>File</button></li>
          <li><button>View</button></li>
          <li><button onClick={this.helpClickHandler.bind(this)}>Help</button></li>
        </ul>
        <ul className='right'>
          <li><button>User</button></li>
        </ul>
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
        {isOpen && this.props.displayItems}
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