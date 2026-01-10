import { X } from 'lucide-react';
import Modal from './Modal';

const PosterModal = ({ isOpen, onClose, posterImage, posterAlt = "Special Offer" }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-2xl"
      maxHeight="max-h-[90vh]"
      className="p-0 bg-transparent shadow-none"
    >
      <div className="relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-30 p-2 bg-gray-600 hover:bg-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-white"
          aria-label="Close poster"
        >
          <X size={18} className="text-white font-bold stroke-[2]" />
        </button>

        {/* Clickable poster image that opens Google Form */}
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSeDX0dtxDzX-k2FGwV1RCgxT1Qecmm4a4jKbJfI_EPYkTbfaA/viewform?embedded=true"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={posterImage}
            alt={posterAlt}
            className="w-full h-auto max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl cursor-pointer"
            style={{ display: 'block' }}
          />
        </a>
      </div>
    </Modal>
  );
};

export default PosterModal;
