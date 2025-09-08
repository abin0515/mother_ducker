'use client';
import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'default' | 'prominent' | 'subtle';
}

const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, title, subtitle, action, icon, variant = 'default', ...props }, ref) => {
    
    const variantStyles = {
      default: {
        container: 'border-b border-secondary-200 pb-4 mb-6',
        title: 'text-lg font-semibold text-secondary-900',
        subtitle: 'text-sm text-secondary-600 mt-1'
      },
      prominent: {
        container: 'border-b-2 border-primary-200 pb-6 mb-8',
        title: 'text-xl font-bold text-secondary-900',
        subtitle: 'text-base text-secondary-600 mt-2'
      },
      subtle: {
        container: 'mb-4',
        title: 'text-base font-medium text-secondary-900',
        subtitle: 'text-sm text-secondary-500 mt-1'
      }
    };

    const styles = variantStyles[variant];

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start justify-between',
          styles.container,
          className
        )}
        {...props}
      >
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {icon && (
            <div className="flex-shrink-0 mt-1">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className={styles.title}>
              {title}
            </h3>
            {subtitle && (
              <p className={styles.subtitle}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {action && (
          <div className="flex-shrink-0 ml-4">
            {action}
          </div>
        )}
      </div>
    );
  }
);

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;

