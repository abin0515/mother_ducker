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
    
    // Base button styles - Healthcare Professional Design
    const baseStyles = [
      'inline-flex items-center justify-center',
      'font-medium rounded-medical transition-all duration-250',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'active:scale-95 transform-gpu', // Subtle press effect with GPU acceleration
      'shadow-medical hover:shadow-medical-lg', // Enhanced shadow on hover
      'hover:-translate-y-0.5' // Subtle lift effect
    ];

    // Healthcare Professional Variant Styles
    const variantStyles = {
      primary: [
        'bg-primary-500 text-white',
        'hover:bg-primary-600 hover:shadow-medical-lg',
        'focus:ring-primary-500/20',
        'disabled:hover:bg-primary-500'
      ],
      secondary: [
        'bg-secondary-100 text-secondary-700',
        'hover:bg-secondary-200 hover:shadow-medical-lg',
        'focus:ring-secondary-500/20',
        'disabled:hover:bg-secondary-100'
      ],
      ghost: [
        'bg-transparent text-secondary-600',
        'hover:bg-secondary-100 hover:text-secondary-700',
        'focus:ring-secondary-500/20',
        'shadow-none'
      ],
      danger: [
        'bg-error-500 text-white',
        'hover:bg-error-600 hover:shadow-medical-lg',
        'focus:ring-error-500/20',
        'disabled:hover:bg-error-500'
      ],
      success: [
        'bg-success-500 text-white',
        'hover:bg-success-600 hover:shadow-medical-lg',
        'focus:ring-success-500/20',
        'disabled:hover:bg-success-500'
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

