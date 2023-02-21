import React, { useState } from 'react';

import 'reactflow/dist/style.css';

function NodeModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if (props.type === "node") {
    return (
      <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Add Molecule
                </a>
                <ul className="dropdown-menu">
                  <li><button onClick={props.onAdd}>add default Molecule</button></li>
                  <li><button onClick={props.onNew}>add new Molecule</button></li>
                </ul>
        </li>
    );
  }
  else {
    return (
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          Add Enzyme
        </a>
        <ul className="dropdown-menu">
          <li><button onClick={props.onAdd}>add default Enzyme</button></li>
          {/* <li>
            <button onClick={props.onNew}>add new Enzyme</button>
          </li> */}
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Add Enzyme
            </a>
            <ul className="dropdown-menu">
              <li><button onClick={props.onAdd}>add default Enzyme</button></li>
              <li>
                <button onClick={props.onNew}>add new Enzyme</button>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    );
  }
}

export default NodeModal;