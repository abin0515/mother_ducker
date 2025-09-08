'use client';
import { cn } from '@/lib/utils';

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'bars';
  color?: 'blue' | 'gray' | 'white' | 'green' | 'red' | 'yellow';
  className?: string;
  label?: string;
}

const Spinner = ({
  size = 'md',
  variant = 'default',
  color = 'blue',
  className,
  label = 'Loading...'
}: SpinnerProps) => {
  
  // Size styles
  const sizeStyles = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  // Color styles
  const colorStyles = {
    blue: 'text-blue-600',
    gray: 'text-gray-600',
    white: 'text-white',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600'
  };

  // Default spinner (rotating circle)
  const DefaultSpinner = () => (
    <svg
      className={cn(
        'animate-spin',
        sizeStyles[size],
        colorStyles[color],
        className
      )}
      fill="none"
      viewBox="0 0 24 24"
      aria-label={label}
      role="status"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Dots spinner
  const DotsSpinner = () => {
    const dotSize = size === 'xs' ? 'w-1 h-1' : size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : size === 'lg' ? 'w-2.5 h-2.5' : 'w-3 h-3';
    
    return (
      <div 
        className={cn('flex space-x-1', className)}
        aria-label={label}
        role="status"
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'rounded-full animate-pulse',
              dotSize,
              colorStyles[color].replace('text-', 'bg-')
            )}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    );
  };

  // Pulse spinner
  const PulseSpinner = () => (
    <div
      className={cn(
        'animate-pulse rounded-full',
        sizeStyles[size],
        colorStyles[color].replace('text-', 'bg-'),
        className
      )}
      aria-label={label}
      role="status"
    />
  );

  // Bars spinner
  const BarsSpinner = () => {
    const barWidth = size === 'xs' ? 'w-0.5' : size === 'sm' ? 'w-1' : size === 'md' ? 'w-1' : size === 'lg' ? 'w-1.5' : 'w-2';
    const barHeight = size === 'xs' ? 'h-3' : size === 'sm' ? 'h-4' : size === 'md' ? 'h-6' : size === 'lg' ? 'h-8' : 'h-12';
    
    return (
      <div 
        className={cn('flex items-end space-x-0.5', className)}
        aria-label={label}
        role="status"
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              'animate-pulse',
              barWidth,
              barHeight,
              colorStyles[color].replace('text-', 'bg-')
            )}
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: '1.2s'
            }}
          />
        ))}
      </div>
    );
  };

  // Render appropriate spinner variant
  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return <DotsSpinner />;
      case 'pulse':
        return <PulseSpinner />;
      case 'bars':
        return <BarsSpinner />;
      default:
        return <DefaultSpinner />;
    }
  };

  return renderSpinner();
};

// Loading overlay component
export interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  spinner?: SpinnerProps;
  message?: string;
  className?: string;
}

const LoadingOverlay = ({
  isLoading,
  children,
  spinner = {},
  message = 'Loading...',
  className
}: LoadingOverlayProps) => {
  return (
    <div className={cn('relative', className)}>
      {children}
      
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center z-10">
          <Spinner {...spinner} />
          {message && (
            <p className="mt-3 text-sm text-gray-600 font-medium">
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

Spinner.displayName = 'Spinner';
LoadingOverlay.displayName = 'LoadingOverlay';

export default Spinner;
export { Spinner, LoadingOverlay };
