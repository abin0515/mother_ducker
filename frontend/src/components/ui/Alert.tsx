'use client';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  children: ReactNode;
  icon?: ReactNode;
  showIcon?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const Alert = ({
  variant = 'info',
  size = 'md',
  title,
  children,
  icon,
  showIcon = true,
  dismissible = false,
  onDismiss,
  className
}: AlertProps) => {
  
  // Base styles
  const baseStyles = [
    'rounded-lg border flex items-start space-x-3 transition-all duration-200'
  ];

  // Healthcare Professional Variant Styles
  const variantStyles = {
    info: [
      'bg-info-50 border-info-500/20 text-info-700'
    ],
    success: [
      'bg-success-50 border-success-500/20 text-success-700'
    ],
    warning: [
      'bg-warning-50 border-warning-500/20 text-warning-700'
    ],
    error: [
      'bg-error-50 border-error-500/20 text-error-700'
    ]
  };

  // Size styles
  const sizeStyles = {
    sm: 'p-3 text-sm',
    md: 'p-4 text-base',
    lg: 'p-6 text-lg'
  };

  // Healthcare Professional Icon Styles
  const iconStyles = {
    info: 'text-info-500',
    success: 'text-success-500',
    warning: 'text-warning-500',
    error: 'text-error-500'
  };

  // Default icons
  const defaultIcons = {
    info: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  return (
    <div 
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      role="alert"
    >
      {/* Icon */}
      {showIcon && (
        <div className={cn('flex-shrink-0 mt-0.5', iconStyles[variant])}>
          {icon || defaultIcons[variant]}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="font-semibold mb-1">
            {title}
          </h4>
        )}
        <div className={title ? 'text-sm opacity-90' : ''}>
          {children}
        </div>
      </div>

      {/* Dismiss Button */}
      {dismissible && (
        <button
          onClick={onDismiss}
          className={cn(
            'flex-shrink-0 ml-auto pl-3 opacity-70 hover:opacity-100 transition-opacity',
            iconStyles[variant]
          )}
          aria-label="Dismiss alert"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

// Preset alert components for common use cases
const InfoAlert = (props: Omit<AlertProps, 'variant'>) => (
  <Alert variant="info" {...props} />
);

const SuccessAlert = (props: Omit<AlertProps, 'variant'>) => (
  <Alert variant="success" {...props} />
);

const WarningAlert = (props: Omit<AlertProps, 'variant'>) => (
  <Alert variant="warning" {...props} />
);

const ErrorAlert = (props: Omit<AlertProps, 'variant'>) => (
  <Alert variant="error" {...props} />
);

Alert.displayName = 'Alert';
InfoAlert.displayName = 'InfoAlert';
SuccessAlert.displayName = 'SuccessAlert';
WarningAlert.displayName = 'WarningAlert';
ErrorAlert.displayName = 'ErrorAlert';

export default Alert;
export { InfoAlert, SuccessAlert, WarningAlert, ErrorAlert };
