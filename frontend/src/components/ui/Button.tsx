'use client';
import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    icon,
    disabled,
    children,
    ...props 
  }, ref) => {
    
    // Base button styles
    const baseStyles = [
      'inline-flex items-center justify-center',
      'font-medium rounded-lg transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'active:scale-95' // Subtle press effect
    ];

    // Variant styles
    const variantStyles = {
      primary: [
        'bg-blue-600 text-white shadow-sm',
        'hover:bg-blue-700 hover:shadow-md',
        'focus:ring-blue-500',
        'disabled:hover:bg-blue-600'
      ],
      secondary: [
        'bg-gray-100 text-gray-900 shadow-sm',
        'hover:bg-gray-200 hover:shadow-md',
        'focus:ring-gray-500',
        'disabled:hover:bg-gray-100'
      ],
      ghost: [
        'bg-transparent text-gray-700',
        'hover:bg-gray-100 hover:text-gray-900',
        'focus:ring-gray-500'
      ],
      danger: [
        'bg-red-600 text-white shadow-sm',
        'hover:bg-red-700 hover:shadow-md',
        'focus:ring-red-500',
        'disabled:hover:bg-red-600'
      ],
      success: [
        'bg-green-600 text-white shadow-sm',
        'hover:bg-green-700 hover:shadow-md',
        'focus:ring-green-500',
        'disabled:hover:bg-green-600'
      ]
    };

    // Size styles
    const sizeStyles = {
      sm: ['text-sm px-3 py-1.5 gap-1.5'],
      md: ['text-sm px-4 py-2 gap-2'],
      lg: ['text-base px-6 py-3 gap-2.5'],
      xl: ['text-lg px-8 py-4 gap-3']
    };

    return (
      <button
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        )}
        {!loading && icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

