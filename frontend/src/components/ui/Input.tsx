'use client';
import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  state?: 'default' | 'error' | 'success' | 'warning';
  label?: string;
  helperText?: string;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className,
    variant = 'default',
    size = 'md',
    state = 'default',
    label,
    helperText,
    errorMessage,
    leftIcon,
    rightIcon,
    loading = false,
    disabled,
    type = 'text',
    ...props 
  }, ref) => {
    
    // Determine final state (error takes precedence)
    const finalState = errorMessage ? 'error' : state;
    const isDisabled = disabled || loading;
    
    // Base input styles
    const baseStyles = [
      'w-full transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      'placeholder:text-gray-400',
      'disabled:opacity-50 disabled:cursor-not-allowed'
    ];

    // Variant styles
    const variantStyles = {
      default: [
        'bg-white border border-gray-300 rounded-lg',
        'hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500/20'
      ],
      filled: [
        'bg-gray-50 border border-transparent rounded-lg',
        'hover:bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20'
      ],
      outlined: [
        'bg-transparent border-2 border-gray-300 rounded-lg',
        'hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500/20'
      ]
    };

    // Size styles
    const sizeStyles = {
      sm: leftIcon || rightIcon ? 'h-9 pl-9 pr-9 text-sm' : 'h-9 px-3 text-sm',
      md: leftIcon || rightIcon ? 'h-11 pl-11 pr-11 text-base' : 'h-11 px-4 text-base',
      lg: leftIcon || rightIcon ? 'h-13 pl-13 pr-13 text-lg' : 'h-13 px-5 text-lg'
    };

    // State styles
    const stateStyles = {
      default: '',
      error: 'border-red-300 focus:border-red-500 focus:ring-red-500/20',
      success: 'border-green-300 focus:border-green-500 focus:ring-green-500/20',
      warning: 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500/20'
    };

    // Icon positioning
    const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
    const leftIconPosition = size === 'sm' ? 'left-3' : size === 'lg' ? 'left-4' : 'left-3';
    const rightIconPosition = size === 'sm' ? 'right-3' : size === 'lg' ? 'right-4' : 'right-3';

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className={cn(
              'absolute top-1/2 transform -translate-y-1/2 text-gray-400',
              leftIconPosition
            )}>
              <div className={iconSize}>
                {leftIcon}
              </div>
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            type={type}
            disabled={isDisabled}
            className={cn(
              baseStyles,
              variantStyles[variant],
              sizeStyles[size],
              stateStyles[finalState],
              leftIcon && (size === 'sm' ? 'pl-9' : size === 'lg' ? 'pl-12' : 'pl-10'),
              rightIcon && (size === 'sm' ? 'pr-9' : size === 'lg' ? 'pr-12' : 'pr-10'),
              className
            )}
            {...props}
          />

          {/* Right Icon / Loading Spinner */}
          {(rightIcon || loading) && (
            <div className={cn(
              'absolute top-1/2 transform -translate-y-1/2',
              rightIconPosition
            )}>
              {loading ? (
                <div className={cn('animate-spin text-gray-400', iconSize)}>
                  <svg fill="none" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
              ) : (
                <div className={cn('text-gray-400', iconSize)}>
                  {rightIcon}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Helper Text / Error Message */}
        {(helperText || errorMessage) && (
          <div className="mt-1.5 text-sm">
            {errorMessage ? (
              <p className="text-red-600 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errorMessage}</span>
              </p>
            ) : helperText ? (
              <p className="text-gray-500">{helperText}</p>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
