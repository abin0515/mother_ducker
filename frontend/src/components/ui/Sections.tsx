'use client';
import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// Section Root
export interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'transparent' | 'white' | 'gray' | 'primary';
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, children, spacing = 'md', background = 'transparent', ...props }, ref) => {
    
    const spacingStyles = {
      sm: 'py-medical-lg',
      md: 'py-section',
      lg: 'py-medical-xl',
      xl: 'py-24'
    };

    const backgroundStyles = {
      transparent: 'bg-transparent',
      white: 'bg-white',
      gray: 'bg-secondary-50',
      primary: 'bg-primary-50'
    };

    return (
      <section
        ref={ref}
        className={cn(
          spacingStyles[spacing],
          backgroundStyles[background],
          className
        )}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = 'Section';

// Section Container
export interface SectionContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const SectionContainer = forwardRef<HTMLDivElement, SectionContainerProps>(
  ({ className, children, size = 'lg', ...props }, ref) => {
    
    const sizeStyles = {
      sm: 'max-w-3xl',
      md: 'max-w-4xl',
      lg: 'max-w-7xl',
      xl: 'max-w-[1400px]',
      full: 'max-w-none'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto px-4 sm:px-6 lg:px-8',
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

SectionContainer.displayName = 'SectionContainer';

// Section Header
export interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  spacing?: 'sm' | 'md' | 'lg';
}

const SectionHeaderComponent = forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, children, align = 'center', spacing = 'md', ...props }, ref) => {
    
    const alignStyles = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    };

    const spacingStyles = {
      sm: 'mb-medical-lg',
      md: 'mb-section',
      lg: 'mb-medical-xl'
    };

    return (
      <div
        ref={ref}
        className={cn(
          alignStyles[align],
          spacingStyles[spacing],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SectionHeaderComponent.displayName = 'SectionHeaderComponent';

// Section Title
export interface SectionTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SectionTitle = forwardRef<HTMLHeadingElement, SectionTitleProps>(
  ({ className, children, level = 2, size = 'lg', ...props }, ref) => {
    const Component = `h${level}` as keyof JSX.IntrinsicElements;
    
    const sizeStyles = {
      sm: 'text-medical-xl',
      md: 'text-medical-2xl',
      lg: 'text-medical-3xl',
      xl: 'text-4xl'
    };

    return (
      <Component
        ref={ref}
        className={cn(
          'font-bold text-secondary-900 leading-tight',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

SectionTitle.displayName = 'SectionTitle';

// Section Subtitle
export interface SectionSubtitleProps extends HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const SectionSubtitle = forwardRef<HTMLParagraphElement, SectionSubtitleProps>(
  ({ className, children, size = 'md', ...props }, ref) => {
    
    const sizeStyles = {
      sm: 'text-medical-base',
      md: 'text-medical-lg',
      lg: 'text-medical-xl'
    };

    return (
      <p
        ref={ref}
        className={cn(
          'text-secondary-600 mt-4 leading-relaxed',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);

SectionSubtitle.displayName = 'SectionSubtitle';

// Section Content
export interface SectionContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg';
}

const SectionContent = forwardRef<HTMLDivElement, SectionContentProps>(
  ({ className, children, spacing = 'md', ...props }, ref) => {
    
    const spacingStyles = {
      sm: 'space-y-medical-md',
      md: 'space-y-medical-lg',
      lg: 'space-y-section'
    };

    return (
      <div
        ref={ref}
        className={cn(
          spacingStyles[spacing],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SectionContent.displayName = 'SectionContent';

// Section Grid
export interface SectionGridProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6;
  gap?: 'sm' | 'md' | 'lg';
  responsive?: boolean;
}

const SectionGrid = forwardRef<HTMLDivElement, SectionGridProps>(
  ({ className, children, columns = 3, gap = 'md', responsive = true, ...props }, ref) => {
    
    const columnStyles = {
      1: 'grid-cols-1',
      2: responsive ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2',
      3: responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-3',
      4: responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-4',
      6: responsive ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6' : 'grid-cols-6'
    };

    const gapStyles = {
      sm: 'gap-medical-md',
      md: 'gap-medical-lg',
      lg: 'gap-section'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          columnStyles[columns],
          gapStyles[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SectionGrid.displayName = 'SectionGrid';

// Section Actions
export interface SectionActionsProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  spacing?: 'sm' | 'md' | 'lg';
}

const SectionActions = forwardRef<HTMLDivElement, SectionActionsProps>(
  ({ className, children, align = 'center', spacing = 'md', ...props }, ref) => {
    
    const alignStyles = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end'
    };

    const spacingStyles = {
      sm: 'gap-medical-sm mt-medical-lg',
      md: 'gap-medical-md mt-section',
      lg: 'gap-medical-lg mt-medical-xl'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center flex-wrap',
          alignStyles[align],
          spacingStyles[spacing],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SectionActions.displayName = 'SectionActions';

export { 
  Section, 
  SectionContainer, 
  SectionHeaderComponent as SectionHeaderLayout, 
  SectionTitle, 
  SectionSubtitle, 
  SectionContent, 
  SectionGrid, 
  SectionActions 
};
