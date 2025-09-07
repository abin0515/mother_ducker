'use client';
import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// Card Container
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    
    const baseStyles = [
      'bg-white rounded-lg transition-all duration-200'
    ];

    const variantStyles = {
      default: ['border border-gray-200 shadow-sm'],
      elevated: ['shadow-lg hover:shadow-xl border border-gray-100'],
      outlined: ['border-2 border-gray-200 hover:border-gray-300'],
      ghost: ['border-0 shadow-none']
    };

    const paddingStyles = {
      none: ['p-0'],
      sm: ['p-3'],
      md: ['p-4 sm:p-6'],
      lg: ['p-6 sm:p-8'],
      xl: ['p-8 sm:p-10']
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Header
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-between mb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

// Card Title
export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, level = 3, ...props }, ref) => {
    const Component = `h${level}` as keyof JSX.IntrinsicElements;
    
    const levelStyles = {
      1: 'text-3xl font-bold',
      2: 'text-2xl font-bold', 
      3: 'text-lg font-semibold',
      4: 'text-base font-semibold',
      5: 'text-sm font-semibold',
      6: 'text-xs font-semibold'
    };

    return (
      <Component
        ref={ref}
        className={cn(
          'text-gray-900 leading-tight',
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

CardTitle.displayName = 'CardTitle';

// Card Content
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-gray-700', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

// Card Actions
export interface CardActionsProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(
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
          'flex items-center gap-3 mt-6',
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

CardActions.displayName = 'CardActions';

export { Card, CardHeader, CardTitle, CardContent, CardActions };

