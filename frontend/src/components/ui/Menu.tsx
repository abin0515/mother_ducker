'use client';
import React, { forwardRef, HTMLAttributes, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// Menu Root
export interface MenuProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Menu = forwardRef<HTMLDivElement, MenuProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative inline-block text-left', className)}
      {...props}
    >
      {children}
    </div>
  )
);

Menu.displayName = 'Menu';

// Menu Trigger
export interface MenuTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
}

const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>(
  ({ className, children, asChild, ...props }, ref) => {
    
    if (asChild) {
      return <>{children}</>;
    }

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'px-4 py-2 text-medical-base font-medium',
          'bg-white border border-secondary-200 rounded-medical shadow-medical',
          'text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
          'transition-all duration-250',
          className
        )}
        {...props}
      >
        {children}
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    );
  }
);

MenuTrigger.displayName = 'MenuTrigger';

// Menu Content
export interface MenuContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  align?: 'left' | 'right';
  sideOffset?: number;
}

const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>(
  ({ className, children, open, onOpenChange, align = 'left', sideOffset = 4, ...props }, ref) => {
    const contentRef = useRef<HTMLDivElement>(null);

    // Handle click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
          onOpenChange(false);
        }
      };

      if (open) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [open, onOpenChange]);

    // Handle escape key
    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && open) {
          onOpenChange(false);
        }
      };

      if (open) {
        document.addEventListener('keydown', handleEscape);
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }, [open, onOpenChange]);

    if (!open) return null;

    const alignStyles = {
      left: 'left-0',
      right: 'right-0'
    };

    return (
      <div
        ref={contentRef}
        className={cn(
          'absolute z-50 mt-1 min-w-[200px]',
          'bg-white border border-secondary-200 rounded-medical shadow-medical-lg',
          'animate-fade-in',
          alignStyles[align],
          className
        )}
        style={{ top: `calc(100% + ${sideOffset}px)` }}
        {...props}
      >
        <div className="py-1">
          {children}
        </div>
      </div>
    );
  }
);

MenuContent.displayName = 'MenuContent';

// Menu Item
export interface MenuItemProps extends HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  disabled?: boolean;
  destructive?: boolean;
}

const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(
  ({ className, children, disabled, destructive, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      className={cn(
        'w-full text-left px-4 py-2 text-medical-sm',
        'transition-colors duration-200',
        // Default state
        'text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900',
        // Destructive variant
        destructive && 'text-error-600 hover:bg-error-50 hover:text-error-700',
        // Disabled state
        disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
        // Focus state
        'focus:outline-none focus:bg-secondary-100 focus:text-secondary-900',
        destructive && 'focus:bg-error-100 focus:text-error-700',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

MenuItem.displayName = 'MenuItem';

// Menu Separator
export interface MenuSeparatorProps extends HTMLAttributes<HTMLDivElement> {}

const MenuSeparator = forwardRef<HTMLDivElement, MenuSeparatorProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'h-px bg-secondary-200 my-1 mx-2',
        className
      )}
      {...props}
    />
  )
);

MenuSeparator.displayName = 'MenuSeparator';

// Menu Label
export interface MenuLabelProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const MenuLabel = forwardRef<HTMLDivElement, MenuLabelProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'px-4 py-2 text-medical-xs font-semibold text-secondary-500 uppercase tracking-wide',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

MenuLabel.displayName = 'MenuLabel';

// Dropdown Menu (convenience component)
export interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ 
  trigger, 
  children, 
  align = 'left',
  className 
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Menu className={className}>
      <div onClick={() => setOpen(!open)}>
        {trigger}
      </div>
      <MenuContent open={open} onOpenChange={setOpen} align={align}>
        {children}
      </MenuContent>
    </Menu>
  );
};

DropdownMenu.displayName = 'DropdownMenu';

export { Menu, MenuTrigger, MenuContent, MenuItem, MenuSeparator, MenuLabel, DropdownMenu };
