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
    <>
      <button onClick={openModal}>Help</button>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2>Help</h2>
        <p>{content}</p>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </>
  );
};

export default Help;