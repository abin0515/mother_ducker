'use client';
import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', icon, children, ...props }, ref) => {
    
    const baseStyles = [
      'inline-flex items-center font-medium rounded-full',
      'transition-all duration-250 transform-gpu',
      'hover:scale-105 hover:shadow-medical' // Subtle hover effects
    ];

    const variantStyles = {
      default: ['bg-secondary-100 text-secondary-800 border border-secondary-200'],
      success: ['bg-success-50 text-success-700 border border-success-500/20'],
      warning: ['bg-warning-50 text-warning-700 border border-warning-500/20'],
      danger: ['bg-error-50 text-error-700 border border-error-500/20'],
      info: ['bg-info-50 text-info-700 border border-info-500/20'],
      purple: ['bg-primary-50 text-primary-800 border border-primary-200']
    };

    const sizeStyles = {
      sm: ['text-xs px-2 py-0.5 gap-1'],
      md: ['text-sm px-2.5 py-1 gap-1.5'],
      lg: ['text-base px-3 py-1.5 gap-2']
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;

