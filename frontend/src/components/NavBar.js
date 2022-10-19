import React, { Component } from 'react'
import './NavBar.css';

export default class NavBar extends Component {
  render() {
    return (
      <div className='NavBar'>
        <ul className='left'>
          <li><button>File</button></li>
          <li><button>View</button></li>
          <li><button>Help</button></li>
        </ul>
        <ul className='right'>
          <li><button>User</button></li>
        </ul>
      </div>
    )
  }
}