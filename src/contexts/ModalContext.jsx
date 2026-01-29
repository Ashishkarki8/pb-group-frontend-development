import React, { createContext, useState } from 'react';
import AdminModal from '../components/common/AdminModal';

// ✅ ADD THIS LINE!
export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalSize, setModalSize] = useState('default');

  const openModal = (content, title = '', size = 'default') => {
    setModalContent(content);
    setModalTitle(title);
    setModalSize(size);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setModalContent(null);
      setModalTitle('');
      setModalSize('default');
    }, 300);
  };

  // ✅ Render content - handle both function and component
  const renderContent = () => {
    if (typeof modalContent === 'function') {
      return modalContent(); // Call the function to get the component
    }
    return modalContent; // Render component directly
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}
      <AdminModal 
        isOpen={isOpen} 
        onClose={closeModal} 
        title={modalTitle}
        size={modalSize}
      >
        {renderContent()}
      </AdminModal>
    </ModalContext.Provider>
  );
};