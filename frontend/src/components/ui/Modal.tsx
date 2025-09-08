'use client';
import { Fragment, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  title?: string;
  description?: string;
  className?: string;
  overlayClassName?: string;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  title,
  description,
  className,
  overlayClassName
}: ModalProps) => {
  
  // Handle escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (closeOnEscape && e.key === 'Escape') {
      onClose();
    }
  };

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Size styles
  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Backdrop */}
      <div 
        className={cn(
          'fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300',
          overlayClassName
        )}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      
      {/* Modal Container */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div 
          className={cn(
            'relative bg-white rounded-lg shadow-xl w-full',
            'transform transition-all duration-300',
            'max-h-[90vh] flex flex-col',
            sizeStyles[size],
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-describedby={description ? 'modal-description' : undefined}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex-1">
                {title && (
                  <h2 
                    id="modal-title" 
                    className="text-xl font-semibold text-gray-900"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p 
                    id="modal-description" 
                    className="mt-1 text-sm text-gray-500"
                  >
                    {description}
                  </p>
                )}
              </div>
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="ml-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal Header Component
export interface ModalHeaderProps {
  children: ReactNode;
  className?: string;
}

const ModalHeader = ({ children, className }: ModalHeaderProps) => (
  <div className={cn('pb-4 border-b border-gray-200', className)}>
    {children}
  </div>
);

// Modal Body Component
export interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

const ModalBody = ({ children, className }: ModalBodyProps) => (
  <div className={cn('py-4', className)}>
    {children}
  </div>
);

// Modal Footer Component
export interface ModalFooterProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

const ModalFooter = ({ 
  children, 
  className, 
  align = 'right' 
}: ModalFooterProps) => {
  const alignStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  };

  return (
    <div className={cn(
      'pt-4 border-t border-gray-200 flex items-center space-x-3',
      alignStyles[align],
      className
    )}>
      {children}
    </div>
  );
};

Modal.displayName = 'Modal';
ModalHeader.displayName = 'ModalHeader';
ModalBody.displayName = 'ModalBody';
ModalFooter.displayName = 'ModalFooter';

export default Modal;
export { ModalHeader, ModalBody, ModalFooter };
