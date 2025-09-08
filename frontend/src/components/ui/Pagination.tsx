'use client';
import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// Pagination Root
export interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  size?: 'sm' | 'md' | 'lg';
}

const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  ({ 
    className, 
    currentPage, 
    totalPages, 
    onPageChange,
    showFirstLast = true,
    showPrevNext = true,
    maxVisiblePages = 7,
    size = 'md',
    ...props 
  }, ref) => {
    
    const sizeStyles = {
      sm: {
        container: 'gap-1',
        button: 'h-8 w-8 text-medical-sm',
        textButton: 'px-3 py-1 text-medical-sm'
      },
      md: {
        container: 'gap-2',
        button: 'h-10 w-10 text-medical-base',
        textButton: 'px-4 py-2 text-medical-base'
      },
      lg: {
        container: 'gap-2',
        button: 'h-12 w-12 text-medical-lg',
        textButton: 'px-6 py-3 text-medical-lg'
      }
    };

    const styles = sizeStyles[size];

    // Calculate visible page numbers
    const getVisiblePages = () => {
      const delta = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, currentPage - delta);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const visiblePages = getVisiblePages();
    const showStartEllipsis = visiblePages[0] > 2;
    const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1;

    const PaginationButton: React.FC<{
      page: number;
      isActive?: boolean;
      disabled?: boolean;
      children: React.ReactNode;
      onClick?: () => void;
    }> = ({ page, isActive, disabled, children, onClick }) => (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick || (() => onPageChange(page))}
        className={cn(
          'inline-flex items-center justify-center',
          'border border-secondary-200 rounded-medical',
          'font-medium transition-all duration-250',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
          styles.button,
          // Default state
          'bg-white text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900 hover:shadow-medical',
          // Active state
          isActive && 'bg-primary-500 text-white border-primary-500 shadow-medical hover:bg-primary-600',
          // Disabled state
          disabled && 'opacity-50 cursor-not-allowed hover:bg-white hover:text-secondary-700 hover:shadow-none'
        )}
      >
        {children}
      </button>
    );

    const PaginationEllipsis: React.FC = () => (
      <span className={cn(
        'inline-flex items-center justify-center text-secondary-500',
        styles.button
      )}>
        ...
      </span>
    );

    if (totalPages <= 1) return null;

    return (
      <nav
        ref={ref}
        className={cn('flex items-center justify-center', styles.container, className)}
        aria-label="Pagination Navigation"
        {...props}
      >
        {/* First Page */}
        {showFirstLast && currentPage > 1 && (
          <button
            type="button"
            onClick={() => onPageChange(1)}
            className={cn(
              'inline-flex items-center gap-1',
              'border border-secondary-200 rounded-medical bg-white',
              'text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900 hover:shadow-medical',
              'font-medium transition-all duration-250',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
              styles.textButton
            )}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            First
          </button>
        )}

        {/* Previous */}
        {showPrevNext && (
          <PaginationButton
            page={currentPage - 1}
            disabled={currentPage <= 1}
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </PaginationButton>
        )}

        {/* First page if not in visible range */}
        {showStartEllipsis && (
          <>
            <PaginationButton page={1} isActive={currentPage === 1}>
              1
            </PaginationButton>
            <PaginationEllipsis />
          </>
        )}

        {/* Visible page numbers */}
        {visiblePages.map(page => (
          <PaginationButton
            key={page}
            page={page}
            isActive={currentPage === page}
          >
            {page}
          </PaginationButton>
        ))}

        {/* Last page if not in visible range */}
        {showEndEllipsis && (
          <>
            <PaginationEllipsis />
            <PaginationButton page={totalPages} isActive={currentPage === totalPages}>
              {totalPages}
            </PaginationButton>
          </>
        )}

        {/* Next */}
        {showPrevNext && (
          <PaginationButton
            page={currentPage + 1}
            disabled={currentPage >= totalPages}
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </PaginationButton>
        )}

        {/* Last Page */}
        {showFirstLast && currentPage < totalPages && (
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            className={cn(
              'inline-flex items-center gap-1',
              'border border-secondary-200 rounded-medical bg-white',
              'text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900 hover:shadow-medical',
              'font-medium transition-all duration-250',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
              styles.textButton
            )}
          >
            Last
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </nav>
    );
  }
);

Pagination.displayName = 'Pagination';

// Pagination Info (shows "Showing X to Y of Z results")
export interface PaginationInfoProps extends HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  size?: 'sm' | 'md' | 'lg';
}

const PaginationInfo = forwardRef<HTMLDivElement, PaginationInfoProps>(
  ({ 
    className, 
    currentPage, 
    totalPages, 
    totalItems, 
    itemsPerPage,
    size = 'md',
    ...props 
  }, ref) => {
    
    const sizeStyles = {
      sm: 'text-medical-sm',
      md: 'text-medical-base',
      lg: 'text-medical-lg'
    };

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
      <div
        ref={ref}
        className={cn(
          'text-secondary-600',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        Showing <span className="font-medium text-secondary-900">{startItem}</span> to{' '}
        <span className="font-medium text-secondary-900">{endItem}</span> of{' '}
        <span className="font-medium text-secondary-900">{totalItems}</span> results
      </div>
    );
  }
);

PaginationInfo.displayName = 'PaginationInfo';

export { Pagination, PaginationInfo };
