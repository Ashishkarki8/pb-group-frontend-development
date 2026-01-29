import React, { createContext, useState } from 'react';
import ConfirmDialog from '../components/common/ConfirmDialog';

export const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'warning', // 'warning', 'danger', 'info', 'success'
    onConfirm: null,
    onCancel: null,
  });

  const confirm = ({
    title = 'Confirm Action',
    message = 'Are you sure?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning',
  }) => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        type,
        onConfirm: () => {
          resolve(true);
          closeConfirm();
        },
        onCancel: () => {
          resolve(false);
          closeConfirm();
        },
      });
    });
  };

  const closeConfirm = () => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialog {...confirmState} />
    </ConfirmContext.Provider>
  );
};