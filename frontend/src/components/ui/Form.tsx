'use client';
import React, { forwardRef, HTMLAttributes, FormHTMLAttributes, LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// Form Root
export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg';
}

const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ className, children, spacing = 'md', ...props }, ref) => {
    
    const spacingStyles = {
      sm: 'space-y-medical-sm',
      md: 'space-y-medical-md', 
      lg: 'space-y-medical-lg'
    };

    return (
      <form
        ref={ref}
        className={cn(
          'w-full',
          spacingStyles[spacing],
          className
        )}
        {...props}
      >
        {children}
      </form>
    );
  }
);

Form.displayName = 'Form';

// Form Field Container
export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  required?: boolean;
  error?: boolean;
}

const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, children, required, error, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'space-y-medical-xs',
        error && 'text-error-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

FormField.displayName = 'FormField';

// Form Label
export interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, required, size = 'md', ...props }, ref) => {
    
    const sizeStyles = {
      sm: 'text-medical-sm',
      md: 'text-medical-base',
      lg: 'text-medical-lg'
    };

    return (
      <label
        ref={ref}
        className={cn(
          'block font-medium text-secondary-700',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="ml-1 text-error-500" aria-label="Required">
            *
          </span>
        )}
      </label>
    );
  }
);

FormLabel.displayName = 'FormLabel';

// Form Error Message
export interface FormErrorProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  visible?: boolean;
}

const FormError = forwardRef<HTMLDivElement, FormErrorProps>(
  ({ className, children, visible = true, ...props }, ref) => {
    
    if (!visible) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 text-medical-sm text-error-600',
          'animate-fade-in',
          className
        )}
        role="alert"
        {...props}
      >
        <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {children}
      </div>
    );
  }
);

FormError.displayName = 'FormError';

// Form Help Text
export interface FormHelpProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const FormHelp = forwardRef<HTMLDivElement, FormHelpProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'text-medical-sm text-secondary-500',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

FormHelp.displayName = 'FormHelp';

// Form Group (for grouping related fields)
export interface FormGroupProps extends HTMLAttributes<HTMLFieldSetElement> {
  children: React.ReactNode;
  legend?: string;
  spacing?: 'sm' | 'md' | 'lg';
}

const FormGroup = forwardRef<HTMLFieldSetElement, FormGroupProps>(
  ({ className, children, legend, spacing = 'md', ...props }, ref) => {
    
    const spacingStyles = {
      sm: 'space-y-medical-sm',
      md: 'space-y-medical-md',
      lg: 'space-y-medical-lg'
    };

    return (
      <fieldset
        ref={ref}
        className={cn(
          'border border-secondary-200 rounded-medical p-medical-md',
          spacingStyles[spacing],
          className
        )}
        {...props}
      >
        {legend && (
          <legend className="px-2 text-medical-base font-medium text-secondary-900">
            {legend}
          </legend>
        )}
        {children}
      </fieldset>
    );
  }
);

FormGroup.displayName = 'FormGroup';

// Form Actions (for submit buttons, etc.)
export interface FormActionsProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  spacing?: 'sm' | 'md' | 'lg';
}

const FormActions = forwardRef<HTMLDivElement, FormActionsProps>(
  ({ className, children, align = 'right', spacing = 'md', ...props }, ref) => {
    
    const alignStyles = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end'
    };

    const spacingStyles = {
      sm: 'gap-medical-sm',
      md: 'gap-medical-md',
      lg: 'gap-medical-lg'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center',
          alignStyles[align],
          spacingStyles[spacing],
          'pt-medical-md border-t border-secondary-200',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FormActions.displayName = 'FormActions';

export { Form, FormField, FormLabel, FormError, FormHelp, FormGroup, FormActions };
