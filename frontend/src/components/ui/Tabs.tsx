'use client';
import React, { createContext, forwardRef, HTMLAttributes, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

// Tabs Context
interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs component');
  }
  return context;
};

// Tabs Root
export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ 
    className, 
    children, 
    defaultValue, 
    value: controlledValue, 
    onValueChange: controlledOnValueChange,
    orientation = 'horizontal',
    ...props 
  }, ref) => {
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    
    const value = controlledValue ?? internalValue;
    const onValueChange = controlledOnValueChange ?? setInternalValue;

    const orientationStyles = {
      horizontal: 'flex flex-col',
      vertical: 'flex flex-row'
    };

    return (
      <TabsContext.Provider value={{ value, onValueChange, orientation }}>
        <div
          ref={ref}
          className={cn(
            orientationStyles[orientation],
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = 'Tabs';

// Tabs List
export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...props }, ref) => {
    const { orientation } = useTabsContext();
    
    const orientationStyles = {
      horizontal: 'flex border-b border-secondary-200',
      vertical: 'flex flex-col border-r border-secondary-200 min-w-[200px]'
    };

    return (
      <div
        ref={ref}
        role="tablist"
        aria-orientation={orientation}
        className={cn(
          orientationStyles[orientation],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsList.displayName = 'TabsList';

// Tabs Trigger
export interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  value: string;
  disabled?: boolean;
}

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, children, value, disabled, ...props }, ref) => {
    const { value: selectedValue, onValueChange, orientation } = useTabsContext();
    const isSelected = selectedValue === value;

    const orientationStyles = {
      horizontal: {
        base: 'px-6 py-3 border-b-2 transition-all duration-250',
        active: 'border-primary-500 text-primary-600',
        inactive: 'border-transparent text-secondary-600 hover:text-secondary-900 hover:border-secondary-300'
      },
      vertical: {
        base: 'px-4 py-3 border-r-2 text-left transition-all duration-250',
        active: 'border-primary-500 text-primary-600 bg-primary-50',
        inactive: 'border-transparent text-secondary-600 hover:text-secondary-900 hover:border-secondary-300 hover:bg-secondary-50'
      }
    };

    const styles = orientationStyles[orientation];

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isSelected}
        aria-controls={`tabpanel-${value}`}
        id={`tab-${value}`}
        disabled={disabled}
        onClick={() => !disabled && onValueChange(value)}
        className={cn(
          'font-medium text-medical-base focus:outline-none focus:ring-2 focus:ring-primary-500/20',
          styles.base,
          isSelected ? styles.active : styles.inactive,
          disabled && 'opacity-50 cursor-not-allowed hover:text-secondary-600 hover:border-transparent hover:bg-transparent',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

TabsTrigger.displayName = 'TabsTrigger';

// Tabs Content
export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  value: string;
  forceMount?: boolean;
}

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, children, value, forceMount, ...props }, ref) => {
    const { value: selectedValue, orientation } = useTabsContext();
    const isSelected = selectedValue === value;

    if (!forceMount && !isSelected) {
      return null;
    }

    const orientationStyles = {
      horizontal: 'mt-medical-lg',
      vertical: 'ml-medical-lg flex-1'
    };

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`tabpanel-${value}`}
        aria-labelledby={`tab-${value}`}
        hidden={!isSelected}
        className={cn(
          'focus:outline-none',
          orientationStyles[orientation],
          !isSelected && 'hidden',
          isSelected && 'animate-fade-in',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsContent.displayName = 'TabsContent';

// Tabs Header (convenience component for title + description)
export interface TabsHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg';
}

const TabsHeader = forwardRef<HTMLDivElement, TabsHeaderProps>(
  ({ className, children, spacing = 'md', ...props }, ref) => {
    const { orientation } = useTabsContext();
    
    const spacingStyles = {
      sm: 'mb-medical-sm',
      md: 'mb-medical-md',
      lg: 'mb-medical-lg'
    };

    const orientationStyles = {
      horizontal: spacingStyles[spacing],
      vertical: `${spacingStyles[spacing]} mr-medical-lg`
    };

    return (
      <div
        ref={ref}
        className={cn(
          orientationStyles[orientation],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsHeader.displayName = 'TabsHeader';

// Tabs Title
export interface TabsTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  level?: 1 | 2 | 3;
}

const TabsTitle = forwardRef<HTMLHeadingElement, TabsTitleProps>(
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

TabsTitle.displayName = 'TabsTitle';

// Tabs Description
export interface TabsDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

const TabsDescription = forwardRef<HTMLParagraphElement, TabsDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'text-medical-base text-secondary-600 mt-2 leading-relaxed',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
);

TabsDescription.displayName = 'TabsDescription';

export { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent, 
  TabsHeader, 
  TabsTitle, 
  TabsDescription 
};
