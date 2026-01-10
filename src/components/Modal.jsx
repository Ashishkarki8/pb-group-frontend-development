


import React from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  children,
  maxWidth = "max-w-5xl",
  maxHeight = "max-h-[95vh]",
  width = "w-full",
  className = ""
}) => {
  // Close on ESC key
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // ADD THIS - Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center h-screen p-4 md:p-8">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      ></div>
      <div className={`
        relative bg-white rounded-2xl shadow-2xl overflow-hidden z-20
        ${width} ${maxWidth} ${maxHeight} ${className}
      `}>
        {children}
      </div>
    </div>
  );
};

export default Modal;