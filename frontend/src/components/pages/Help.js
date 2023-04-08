import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

const Help = ({ content }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
    <header>
        <meta charset="UTF-8"/>
        <title>Help Page</title>
    </header>
    <body>
        <h1>Help</h1>
        
        <h2>FAQs</h2>
        <ul>
            <li>
            <h3>How do I create a new account?</h3>
            <p>To create a new account, click the "Sign Up" button on the homepage and follow the instructions.</p>
            </li>
            <li>
            <h3>What do I do if I forget my password?</h3>
            <p>If you forget your password, click the "Forgot Password" link on the login page and follow the instructions.</p>
            </li>
        </ul>
        
        <h2>Contact Us</h2>
        <p>If you have any questions or issues, please contact us at <a href="mailto:help@example.com">help@example.com</a>.</p>
    </body>
    </div>
  );
};

export default Help;