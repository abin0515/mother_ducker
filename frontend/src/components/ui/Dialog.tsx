'use client';
import React, { forwardRef, HTMLAttributes, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

// Dialog Root
export interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ className, open, onOpenChange, children, ...props }, ref) => {
    
    // Handle escape key
    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && open) {
          onOpenChange(false);
        }
      };

      if (open) {
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }, [open, onOpenChange]);

    if (!open) return null;

    return createPortal(
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center p-4',
          'animate-fade-in',
          className
        )}
        {...props}
      >
        {/* Healthcare Professional Backdrop */}
        <div
          className="absolute inset-0 bg-secondary-900/50 backdrop-blur-medical"
          onClick={() => onOpenChange(false)}
        />
        
        {/* Dialog Content Container */}
        <div className="relative animate-scale-in">
          {children}
        </div>
      </div>,
      document.body
    );
  }
);

Dialog.displayName = 'Dialog';

// Dialog Content
export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, size = 'md', ...props }, ref) => {
    
    const sizeStyles = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg', 
      xl: 'max-w-xl',
      full: 'max-w-full mx-4'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'w-full bg-white rounded-card shadow-medical-xl',
          'border border-secondary-200',
          'max-h-[90vh] overflow-y-auto',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DialogContent.displayName = 'DialogContent';

// Dialog Header
export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-between p-medical-lg',
        'border-b border-secondary-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

DialogHeader.displayName = 'DialogHeader';

// Dialog Title
export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  level?: 1 | 2 | 3;
}

const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, children, level = 2, ...props }, ref) => {
    const Component = `h${level}` as keyof JSX.IntrinsicElements;
    
    const levelStyles = {
      1: 'text-medical-3xl font-bold',
      2: 'text-medical-2xl font-semibold',
      3: 'text-medical-xl font-semibold'
    };

    return (
      <Component
        ref={ref}
        className={cn(
          'text-secondary-900 leading-tight',
          levelStyles[level],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

DialogTitle.displayName = 'DialogTitle';

// Dialog Close Button
export interface DialogCloseProps extends HTMLAttributes<HTMLButtonElement> {
  onClose: () => void;
}

const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ className, onClose, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      onClick={onClose}
      className={cn(
        'p-2 rounded-medical text-secondary-600',
        'hover:bg-secondary-100 hover:text-secondary-900',
        'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
        'transition-all duration-250',
        className
      )}
      {...props}
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
      <span className="sr-only">Close</span>
    </button>
  )
);

DialogClose.displayName = 'DialogClose';

// Dialog Body
export interface DialogBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'p-medical-lg text-secondary-600',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

DialogBody.displayName = 'DialogBody';

// Dialog Footer
export interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, children, align = 'right', ...props }, ref) => {
    
    const alignStyles = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-medical-sm p-medical-lg',
          'border-t border-secondary-200',
          alignStyles[align],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DialogFooter.displayName = 'DialogFooter';

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogBody, DialogFooter };
