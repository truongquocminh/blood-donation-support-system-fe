import React from 'react';
import { Heart } from 'lucide-react';
import { cn } from '../../utils/helpers';

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'primary', 
  message,
  className,
  showMessage = true,
  showIcon = false
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    large: 'w-20 h-20'
  };

  const variants = {
    primary: 'border-red-500',
    secondary: 'border-gray-500',
    white: 'border-white',
    light: 'border-red-200'
  };

  const messageSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    large: 'text-2xl'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const defaultMessages = {
    sm: 'Đang tải...',
    md: 'Đang tải...',
    lg: 'Đang xử lý...',
    xl: 'Đang xử lý...',
    large: 'Vui lòng chờ...'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-3', className)}>
      {showIcon && (
        <div className="relative mb-2">
          <Heart 
            className={cn(
              iconSizes[size], 
              'text-red-500 animate-pulse'
            )} 
            fill="currentColor" 
          />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
        </div>
      )}
      
      <div
        className={cn(
          'animate-spin rounded-full border-4 border-transparent',
          sizes[size],
          variants[variant]
        )}
        style={{
          borderTopColor: 'currentColor',
          borderRightColor: 'currentColor'
        }}
      />
      
      {showMessage && (
        <p className={cn(
          'text-gray-600 font-medium animate-pulse',
          messageSizes[size]
        )}>
          {message || defaultMessages[size]}
        </p>
      )}
    </div>
  );
};

export const BloodDropLoader = ({ size = 'md', message = 'Đang tải...' }) => {
  const dropSizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={cn(
        'blood-drop bg-gradient-to-b from-red-400 to-red-600 shadow-lg',
        dropSizes[size]
      )}></div>
      {message && (
        <p className="text-gray-600 font-medium animate-pulse">{message}</p>
      )}
    </div>
  );
};

export const HeartBeatLoader = ({ size = 'md', message = 'Đang xử lý...' }) => {
  const heartSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <Heart 
          className={cn(
            heartSizes[size], 
            'text-red-500 animate-pulse'
          )} 
          fill="currentColor" 
        />
        <div className="absolute inset-0 animate-ping">
          <Heart 
            className={cn(heartSizes[size], 'text-red-300')} 
            fill="currentColor" 
          />
        </div>
      </div>
      {message && (
        <p className="text-gray-600 font-medium">{message}</p>
      )}
    </div>
  );
};

export const DotsLoader = ({ size = 'md', variant = 'primary' }) => {
  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const dotColors = {
    primary: 'bg-red-500',
    secondary: 'bg-gray-500',
    white: 'bg-white'
  };

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={cn(
            'rounded-full animate-pulse',
            dotSizes[size],
            dotColors[variant]
          )}
          style={{
            animationDelay: `${index * 0.15}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );
};

export const ProgressLoader = ({ 
  progress = 0, 
  message = 'Đang tải...', 
  showPercentage = true 
}) => {
  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{message}</span>
        {showPercentage && (
          <span className="text-sm font-medium text-red-600">{progress}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const SkeletonLoader = ({ lines = 3, className }) => {
  return (
    <div className={cn('animate-pulse space-y-3', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="flex space-x-4">
          <div className="rounded-full bg-gray-300 h-10 w-10"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton = ({ className }) => {
  return (
    <div className={cn('animate-pulse bg-white rounded-xl shadow-lg p-6', className)}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="rounded-xl bg-gray-300 h-12 w-12"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
        <div className="h-3 bg-gray-300 rounded w-4/6"></div>
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, index) => (
              <div key={index} className="h-4 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
        
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4 border-b border-gray-100">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="h-4 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const FormSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index}>
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
          <div className="h-12 bg-gray-300 rounded"></div>
        </div>
      ))}
      <div className="flex space-x-4 pt-4">
        <div className="h-12 bg-gray-300 rounded w-32"></div>
        <div className="h-12 bg-gray-300 rounded w-24"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;