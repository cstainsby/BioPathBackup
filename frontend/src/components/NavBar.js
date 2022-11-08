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
      <nav className='NavBar'>
        <ul className='NavBarNav'>
          {/* Note: The dropdown Menu will be passed as props.children in NavItem */}
          <NavItem 
            name='File' 
            icon={ fileLogo } 
            linkTo="/#" 
            isOpen={ this.state.navItemOpenStatusDict["File"] } 
            signalChange={ this.signalChange }> 
            {/* The Dropdown menu will be passed Dropdown Item children to display */}
            <DropdownMenu>
              {/* Link to subsequent page should be passed as prop */}
              <DropdownItem linkTo="savePlace">Save</DropdownItem>
              <DropdownItem>Save As</DropdownItem>
              <DropdownItem>Load</DropdownItem>
              <DropdownItem>New</DropdownItem>
              <DropdownItem>Delete</DropdownItem>
            </DropdownMenu>
          </NavItem>

          <NavItem 
            name='View' 
            icon={ viewLogo } 
            linkTo="/#" 
            isOpen={ this.state.navItemOpenStatusDict["View"] } 
            signalChange={ this.signalChange }>
              <DropdownMenu>
                <DropdownItem>Model</DropdownItem>
                <DropdownItem>Text</DropdownItem>
              </DropdownMenu>
          </NavItem>

          <NavItem 
            name='Help' 
            icon={ helpLogo } 
            linkTo="help"
          />

          <NavItem
            name="Snake Game"
            linkTo="https://www.google.com/search?client=firefox-b-1-d&q=snake+game"
          />
          
          <NavItem 
            name='User' 
            icon={ userLogo } 
            linkTo="/#" 
            isOpen={ this.state.navItemOpenStatusDict["User"] } 
            signalChange={ this.signalChange }> 
            <DropdownMenu>
              {/* Link to subsequent page should be passed as prop */}
              <DropdownItem>Log In</DropdownItem>
            </DropdownMenu>
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

    // get open state if passed in by prop, assign default false if not
    let openState = false;
    if(props.isOpen != null) {
      if (props.isOpen === true) openState = true;
      else openState = false;
    } 

    this.state = {
      isOpen: openState // initially set the NavItem to unopened 
    };

    this.handleDropdownClick = this.handleDropdownClick.bind(this);
  }


  // This function handles the display of the dropdown,
  //  NOTE: that it is present in all Nav items but is only 
  //        called by buttons with a dropdown element attached
  handleDropdownClick() {
    // set the isOpen state to true 
    let newState = !this.props.isOpen;
    let buttonName = this.props.name;

    this.setState({
      isOpen: newState
    });
    console.log(
      "In handleDropdownClick(): \n" +
      "   " + buttonName + " button has been clicked: isOpen set to " + newState
      );
    
    // signal parent navbar that this item has been selected if applicable
    if(this.props.signalChange) {
      this.props.signalChange(buttonName, newState);
    }
  }

  render() {
    // figure out where the button will link 
    // 
    let buttonLink = "#";

    if(this.props.linkTo != null) {
      buttonLink = this.props.linkTo;
    }
    
    return (
      <li className='navItem'>
        <a href={ buttonLink } className='navIconButton' title={this.props.name} onClick={this.handleDropdownClick}>
          <img className='navIconButtonImg' src={this.props.icon} />
          <p className='navIconButtonName'>{this.props.name}</p>
          {/* <img class='navIconButtonDropImg' src={dropdownLogo} />  add dropdown later*/}
        </a>

        {/* if isOpen, the html after the && will be rendered if children exist */}
        {this.props.isOpen && this.props.children}
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