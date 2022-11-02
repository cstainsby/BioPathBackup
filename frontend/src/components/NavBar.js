import React, { Component, useState } from 'react'
import './NavBar.css';

// import logos 
import fileLogo from './../icons/folder.png';
import viewLogo from './../icons/search.png';
import helpLogo from './../icons/information.png';
import userLogo from './../icons/user.png';
import dropdownLogo from './../icons/arrow-down-sign-to-navigate.png';


// ----------------------------------------------------------------------
// Navbar
//  this is the base component that holds every child component below
//  This component when rendered will be the main navigation bar above 
//    our main model area 
// ----------------------------------------------------------------------
export default class NavBar extends Component {

  render() {
    return (
      <nav className='NavBar'>
        <ul className='NavBarNav'>
          {/* Note: The dropdown Menu will be passed as props.children in NavItem */}
          <NavItem name='File' icon={ fileLogo }> 
            {/* The Dropdown menu will be passed Dropdown Item children to display */}
            <DropdownMenu>
              {/* Link to subsequent page should be passed as prop */}
              <DropdownItem linkTo="">Save</DropdownItem>
              <DropdownItem>Save As</DropdownItem>
              <DropdownItem>Load</DropdownItem>
              <DropdownItem>New</DropdownItem>
              <DropdownItem>Delete</DropdownItem>
            </DropdownMenu>
          </NavItem>
          <NavItem name='View' icon={ viewLogo }>
              <DropdownMenu>
                <DropdownItem>Model</DropdownItem>
                <DropdownItem>Text</DropdownItem>
              </DropdownMenu>
          </NavItem>
          <NavItem name='Help' icon={ helpLogo } />
          <NavItem name='User' icon={ userLogo }> 
            Tests
          </NavItem>
        </ul>
      </nav>
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

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // set the isOpen state to true 
    this.setState({
      isOpen: !this.state.isOpen
    });
    console.log(this.props.name + " button has been clicked: isOpen set to " + this.state.isOpen);
  }

  render() {
    return (
      <li className='navItem'>
        <a href='#' className='navIconButton' title={this.props.name} onClick={this.handleClick}>
          <img className='navIconButtonImg' src={this.props.icon} />
          <p className='navIconButtonName'>{this.props.name}</p>
          {/* <img class='navIconButtonDropImg' src={dropdownLogo} />  add dropdown later*/}
        </a>

        {/* if isOpen, the html after the && will be rendered if children exist */}
        {this.state.isOpen && this.props.children}
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
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div className='dropdownMenu'>
        <ul className='dropdownMenuList'>
          {this.props.children}
        </ul>
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
  constructor(props) {
    super(props);
  }

  render() {
    // these link labels should all be of type string 
    let menuLinkLabel = this.props.children;
    // links passed in as props
    let menuLink = this.props.linkTo;

    return (
      <li className='dropdownItem'>
        <div className='dropdownItemContents'>
          <a href={ menuLink } className='dropdownItemLink'>
            <span className='leftIcon'></span>
            <p className='dropdownItemLabel'>{ menuLinkLabel }</p>
          </a>
        </div>
      </li>
    );
  }
}