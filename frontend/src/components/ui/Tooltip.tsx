'use client';
import { useState, useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
}

const Tooltip = ({
  content,
  children,
  position = 'top',
  trigger = 'hover',
  delay = 200,
  className,
  contentClassName,
  disabled = false
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (disabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      // Calculate optimal position based on viewport
      calculatePosition();
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let newPosition = position;

    // Check if tooltip fits in preferred position
    switch (position) {
      case 'top':
        if (triggerRect.top - tooltipRect.height < 10) {
          newPosition = 'bottom';
        }
        break;
      case 'bottom':
        if (triggerRect.bottom + tooltipRect.height > viewport.height - 10) {
          newPosition = 'top';
        }
        break;
      case 'left':
        if (triggerRect.left - tooltipRect.width < 10) {
          newPosition = 'right';
        }
        break;
      case 'right':
        if (triggerRect.right + tooltipRect.width > viewport.width - 10) {
          newPosition = 'left';
        }
        break;
    }

    setActualPosition(newPosition);
  };

  // Position styles
  const positionStyles = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  // Arrow styles
  const arrowStyles = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900'
  };

  const handleTriggerEvents = () => {
    const events: any = {};

    if (trigger === 'hover') {
      events.onMouseEnter = showTooltip;
      events.onMouseLeave = hideTooltip;
    } else if (trigger === 'click') {
      events.onClick = () => {
        if (isVisible) {
          hideTooltip();
        } else {
          showTooltip();
        }
      };
    } else if (trigger === 'focus') {
      events.onFocus = showTooltip;
      events.onBlur = hideTooltip;
    }

    return events;
  };

  return (
    <div 
      ref={triggerRef}
      className={cn('relative inline-block', className)}
      {...handleTriggerEvents()}
    >
      {children}
      
      {/* Tooltip Content */}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg',
            'max-w-xs break-words whitespace-normal',
            'animate-in fade-in-0 zoom-in-95 duration-200',
            positionStyles[actualPosition],
            contentClassName
          )}
          role="tooltip"
        >
          {content}
          
          {/* Arrow */}
          <div 
            className={cn(
              'absolute w-0 h-0 border-4',
              arrowStyles[actualPosition]
            )}
          />
        </div>
      )}
    </div>
  );
};

// Simple tooltip with just text
export interface SimpleTooltipProps extends Omit<TooltipProps, 'content'> {
  text: string;
}

const SimpleTooltip = ({ text, ...props }: SimpleTooltipProps) => (
  <Tooltip content={text} {...props} />
);

// Help tooltip with question mark icon
export interface HelpTooltipProps extends Omit<TooltipProps, 'children'> {
  size?: 'sm' | 'md' | 'lg';
}

const HelpTooltip = ({ 
  size = 'md', 
  className,
  ...props 
}: HelpTooltipProps) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <Tooltip {...props} className={className}>
      <button
        type="button"
        className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
        aria-label="Help"
      >
        <svg 
          className={cn(sizeStyles[size])} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </button>
    </Tooltip>
  );
};

Tooltip.displayName = 'Tooltip';
SimpleTooltip.displayName = 'SimpleTooltip';
HelpTooltip.displayName = 'HelpTooltip';

export default Tooltip;
export { Tooltip, SimpleTooltip, HelpTooltip };
