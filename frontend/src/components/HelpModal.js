import React, { Component } from 'react';

import finger from "../icons/hand.png";

// ----------------------------------------------------------------------
// HelpModal
// ----------------------------------------------------------------------
export default class HelpModal extends Component {
  constructor(props) {
    super(props);
    
  }

  render() {
    return (
      <div class="modal fade" id="helpModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Help Not Implemented</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <img src={finger}></img>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Welp...</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


// modals needed 
//  load modal
//  user sign in modal