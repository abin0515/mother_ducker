'use client';
import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// Tag Component
export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  removable?: boolean;
  onRemove?: () => void;
  disabled?: boolean;
}

const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ 
    className, 
    children, 
    variant = 'default', 
    size = 'md', 
    removable = false,
    onRemove,
    disabled = false,
    ...props 
  }, ref) => {
    
    const sizeStyles = {
      xs: {
        container: 'px-2 py-0.5 text-medical-xs',
        removeButton: 'ml-1 h-3 w-3',
        removeIcon: 'h-2 w-2'
      },
      sm: {
        container: 'px-2.5 py-1 text-medical-sm',
        removeButton: 'ml-1.5 h-3.5 w-3.5',
        removeIcon: 'h-2.5 w-2.5'
      },
      md: {
        container: 'px-3 py-1.5 text-medical-base',
        removeButton: 'ml-2 h-4 w-4',
        removeIcon: 'h-3 w-3'
      },
      lg: {
        container: 'px-4 py-2 text-medical-lg',
        removeButton: 'ml-2.5 h-5 w-5',
        removeIcon: 'h-3.5 w-3.5'
      }
    };

    const variantStyles = {
      default: {
        container: 'bg-secondary-100 text-secondary-800 border border-secondary-200',
        removeButton: 'text-secondary-600 hover:text-secondary-800 hover:bg-secondary-200'
      },
      primary: {
        container: 'bg-primary-100 text-primary-800 border border-primary-200',
        removeButton: 'text-primary-600 hover:text-primary-800 hover:bg-primary-200'
      },
      secondary: {
        container: 'bg-secondary-200 text-secondary-900 border border-secondary-300',
        removeButton: 'text-secondary-700 hover:text-secondary-900 hover:bg-secondary-300'
      },
      success: {
        container: 'bg-success-100 text-success-800 border border-success-200',
        removeButton: 'text-success-600 hover:text-success-800 hover:bg-success-200'
      },
      warning: {
        container: 'bg-warning-100 text-warning-800 border border-warning-200',
        removeButton: 'text-warning-600 hover:text-warning-800 hover:bg-warning-200'
      },
      error: {
        container: 'bg-error-100 text-error-800 border border-error-200',
        removeButton: 'text-error-600 hover:text-error-800 hover:bg-error-200'
      },
      info: {
        container: 'bg-info-100 text-info-800 border border-info-200',
        removeButton: 'text-info-600 hover:text-info-800 hover:bg-info-200'
      }
    };

    const sizeStyle = sizeStyles[size];
    const variantStyle = variantStyles[variant];

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full transition-all duration-250',
          sizeStyle.container,
          variantStyle.container,
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {children}
        {removable && !disabled && (
          <button
            type="button"
            onClick={onRemove}
            className={cn(
              'inline-flex items-center justify-center rounded-full',
              'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1',
              'focus:ring-current',
              sizeStyle.removeButton,
              variantStyle.removeButton
            )}
            aria-label="Remove tag"
          >
            <svg 
              className={sizeStyle.removeIcon} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Tag.displayName = 'Tag';

// Tag List Container
export interface TagListProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spacing?: 'xs' | 'sm' | 'md' | 'lg';
  wrap?: boolean;
  align?: 'left' | 'center' | 'right';
}

const TagList = forwardRef<HTMLDivElement, TagListProps>(
  ({ className, children, spacing = 'sm', wrap = true, align = 'left', ...props }, ref) => {
    
    const spacingStyles = {
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4'
    };

    const alignStyles = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center',
          spacingStyles[spacing],
          alignStyles[align],
          wrap && 'flex-wrap',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TagList.displayName = 'TagList';

// Tag Input (for adding new tags)
export interface TagInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  allowDuplicates?: boolean;
  disabled?: boolean;
  variant?: TagProps['variant'];
  size?: TagProps['size'];
}

const TagInput = forwardRef<HTMLDivElement, TagInputProps>(
  ({ 
    className,
    tags,
    onChange,
    placeholder = "Add a tag...",
    maxTags,
    allowDuplicates = false,
    disabled = false,
    variant = 'default',
    size = 'md',
    ...props
  }, ref) => {
    const [inputValue, setInputValue] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addTag();
      } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
        removeTag(tags.length - 1);
      }
    };

    const addTag = () => {
      const trimmedValue = inputValue.trim();
      if (trimmedValue === '') return;
      
      if (!allowDuplicates && tags.includes(trimmedValue)) return;
      if (maxTags && tags.length >= maxTags) return;

      onChange([...tags, trimmedValue]);
      setInputValue('');
    };

    const removeTag = (index: number) => {
      const newTags = tags.filter((_, i) => i !== index);
      onChange(newTags);
    };

    const sizeStyles = {
      xs: 'min-h-[24px] text-medical-xs',
      sm: 'min-h-[28px] text-medical-sm',
      md: 'min-h-[32px] text-medical-base',
      lg: 'min-h-[40px] text-medical-lg'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap items-center gap-2 p-2',
          'border border-secondary-200 rounded-medical bg-white',
          'focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500',
          'transition-all duration-250',
          sizeStyles[size],
          disabled && 'opacity-50 cursor-not-allowed bg-secondary-50',
          className
        )}
        onClick={() => inputRef.current?.focus()}
        {...props}
      >
        {tags.map((tag, index) => (
          <Tag
            key={`${tag}-${index}`}
            variant={variant}
            size={size}
            removable={!disabled}
            onRemove={() => removeTag(index)}
          >
            {tag}
          </Tag>
        ))}
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 ? placeholder : ''}
          disabled={disabled || (maxTags ? tags.length >= maxTags : false)}
          className={cn(
            'flex-1 min-w-[120px] bg-transparent border-0 outline-none',
            'placeholder:text-secondary-400',
            sizeStyles[size]
          )}
        />
      </div>
    );
  }
);

TagInput.displayName = 'TagInput';

// Tag Filter (for filtering/selecting tags)
export interface TagFilterProps extends HTMLAttributes<HTMLDivElement> {
  tags: { label: string; value: string; count?: number }[];
  selectedTags: string[];
  onSelectionChange: (selectedTags: string[]) => void;
  multiSelect?: boolean;
  size?: TagProps['size'];
  variant?: TagProps['variant'];
  showCounts?: boolean;
}

const TagFilter = forwardRef<HTMLDivElement, TagFilterProps>(
  ({ 
    className,
    tags,
    selectedTags,
    onSelectionChange,
    multiSelect = true,
    size = 'md',
    variant = 'default',
    showCounts = false,
    ...props
  }, ref) => {

    const handleTagClick = (value: string) => {
      if (multiSelect) {
        if (selectedTags.includes(value)) {
          onSelectionChange(selectedTags.filter(tag => tag !== value));
        } else {
          onSelectionChange([...selectedTags, value]);
        }
      } else {
        onSelectionChange(selectedTags.includes(value) ? [] : [value]);
      }
    };

    return (
      <TagList ref={ref} className={className} {...props}>
        {tags.map(tag => {
          const isSelected = selectedTags.includes(tag.value);
          return (
            <button
              key={tag.value}
              type="button"
              onClick={() => handleTagClick(tag.value)}
              className="focus:outline-none focus:ring-2 focus:ring-primary-500/20 rounded-full"
            >
              <Tag
                variant={isSelected ? 'primary' : variant}
                size={size}
                className="cursor-pointer hover:scale-105 transition-transform duration-200"
              >
                {tag.label}
                {showCounts && tag.count && (
                  <span className="ml-1 opacity-75">({tag.count})</span>
                )}
              </Tag>
            </button>
          );
        })}
      </TagList>
    );
  }
);

TagFilter.displayName = 'TagFilter';

export { Tag, TagList, TagInput, TagFilter };
