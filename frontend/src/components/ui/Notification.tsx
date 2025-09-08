'use client';
import React, { forwardRef, HTMLAttributes, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

// Notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// Notification Item
export interface NotificationProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  type?: NotificationType;
  duration?: number;
  closable?: boolean;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const Notification = forwardRef<HTMLDivElement, NotificationProps>(
  ({ 
    className, 
    title, 
    description, 
    type = 'info', 
    duration = 5000,
    closable = true,
    onClose,
    action,
    ...props 
  }, ref) => {
    const [visible, setVisible] = useState(true);

    // Auto-dismiss notification
    useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          setVisible(false);
          setTimeout(() => onClose?.(), 300); // Wait for animation
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [duration, onClose]);

    const handleClose = () => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300); // Wait for animation
    };

    const typeStyles = {
      info: {
        container: 'bg-info-50 border-info-200 text-info-800',
        icon: 'text-info-500',
        iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      success: {
        container: 'bg-success-50 border-success-200 text-success-800',
        icon: 'text-success-500',
        iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      warning: {
        container: 'bg-warning-50 border-warning-200 text-warning-800',
        icon: 'text-warning-500',
        iconPath: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      error: {
        container: 'bg-error-50 border-error-200 text-error-800',
        icon: 'text-error-500',
        iconPath: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      }
    };

    const styles = typeStyles[type];

    return (
      <div
        ref={ref}
        className={cn(
          'max-w-md w-full bg-white border rounded-medical shadow-medical-lg p-4',
          'transition-all duration-300 transform',
          visible ? 'animate-slide-down opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
          styles.container,
          className
        )}
        {...props}
      >
        <div className="flex">
          {/* Icon */}
          <div className="flex-shrink-0">
            <svg 
              className={cn('h-5 w-5', styles.icon)} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={styles.iconPath} 
              />
            </svg>
          </div>

          {/* Content */}
          <div className="ml-3 flex-1">
            <h3 className="text-medical-sm font-medium">
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-medical-sm opacity-90">
                {description}
              </p>
            )}
            {action && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={action.onClick}
                  className={cn(
                    'text-medical-sm font-medium underline',
                    'hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2',
                    type === 'info' && 'text-info-600 focus:ring-info-500',
                    type === 'success' && 'text-success-600 focus:ring-success-500',
                    type === 'warning' && 'text-warning-600 focus:ring-warning-500',
                    type === 'error' && 'text-error-600 focus:ring-error-500'
                  )}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>

          {/* Close Button */}
          {closable && (
            <div className="ml-4 flex-shrink-0">
              <button
                type="button"
                onClick={handleClose}
                className={cn(
                  'rounded-medical p-1.5',
                  'hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  'transition-colors duration-200',
                  styles.icon,
                  type === 'info' && 'focus:ring-info-500',
                  type === 'success' && 'focus:ring-success-500',
                  type === 'warning' && 'focus:ring-warning-500',
                  type === 'error' && 'focus:ring-error-500'
                )}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Notification.displayName = 'Notification';

// Notification Container
export interface NotificationContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const NotificationContainer = forwardRef<HTMLDivElement, NotificationContainerProps>(
  ({ className, children, position = 'top-right', ...props }, ref) => {
    
    const positionStyles = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };

    return createPortal(
      <div
        ref={ref}
        className={cn(
          'fixed z-50 flex flex-col gap-2 pointer-events-none',
          positionStyles[position],
          className
        )}
        {...props}
      >
        <div className="flex flex-col gap-2 pointer-events-auto">
          {children}
        </div>
      </div>,
      document.body
    );
  }
);

NotificationContainer.displayName = 'NotificationContainer';

// Toast notification (convenience component)
export interface ToastProps extends Omit<NotificationProps, 'onClose'> {
  id?: string;
}

// Simple toast notification system
class NotificationSystem {
  private notifications: (ToastProps & { id: string })[] = [];
  private listeners: ((notifications: (ToastProps & { id: string })[]) => void)[] = [];

  show(notification: ToastProps) {
    const id = notification.id || Date.now().toString();
    const newNotification = { ...notification, id };
    
    this.notifications = [...this.notifications, newNotification];
    this.notify();

    // Auto-remove after duration
    const duration = notification.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }

    return id;
  }

  remove(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notify();
  }

  clear() {
    this.notifications = [];
    this.notify();
  }

  subscribe(listener: (notifications: (ToastProps & { id: string })[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.notifications));
  }
}

export const toast = new NotificationSystem();

export { Notification, NotificationContainer };
