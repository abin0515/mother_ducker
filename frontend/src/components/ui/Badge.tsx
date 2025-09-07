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
      'transition-colors duration-200'
    ];

    const variantStyles = {
      default: ['bg-gray-100 text-gray-800 border border-gray-200'],
      success: ['bg-green-100 text-green-800 border border-green-200'],
      warning: ['bg-yellow-100 text-yellow-800 border border-yellow-200'],
      danger: ['bg-red-100 text-red-800 border border-red-200'],
      info: ['bg-blue-100 text-blue-800 border border-blue-200'],
      purple: ['bg-purple-100 text-purple-800 border border-purple-200']
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

