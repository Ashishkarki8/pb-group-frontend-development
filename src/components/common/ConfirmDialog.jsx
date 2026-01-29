import React from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  type,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    warning: {
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      icon: AlertTriangle,
    },
    danger: {
      bgColor: 'bg-red-500',
      textColor: 'text-red-600',
      icon: XCircle,
    },
    info: {
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600',
      icon: Info,
    },
    success: {
      bgColor: 'bg-green-500',
      textColor: 'text-green-600',
      icon: CheckCircle,
    },
  };

  const config = typeConfig[type] || typeConfig.warning;
  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`${config.bgColor} rounded-full p-2 shrink-0`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-gray-600">{message}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 ${config.bgColor} text-white rounded-lg hover:opacity-90 transition-opacity`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;