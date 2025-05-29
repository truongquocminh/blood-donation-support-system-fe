import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle, Search } from 'lucide-react';
import { cn } from '../../utils/helpers';

const Input = forwardRef(({
  className,
  type = 'text',
  label,
  placeholder,
  error,
  success,
  helperText,
  icon,
  iconPosition = 'left',
  variant = 'default',
  size = 'md',
  disabled = false,
  required = false,
  showPasswordToggle = false,
  value,
  onChange,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };

  const variants = {
    default: 'border-gray-300 focus:border-red-500 focus:ring-red-500',
    filled: 'bg-gray-50 border-gray-200 focus:bg-white focus:border-red-500 focus:ring-red-500',
    outlined: 'border-2 border-gray-300 focus:border-red-500',
    underlined: 'border-0 border-b-2 border-gray-300 focus:border-red-500 rounded-none px-0'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const inputClasses = cn(
    'w-full rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50',
    sizes[size],
    variants[variant],
    error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
    success && 'border-green-500 focus:border-green-500 focus:ring-green-500',
    disabled && 'bg-gray-100 text-gray-500 cursor-not-allowed',
    icon && iconPosition === 'left' && 'pl-10',
    icon && iconPosition === 'right' && 'pr-10',
    (type === 'password' && showPasswordToggle) && 'pr-10',
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {React.cloneElement(icon, {
              className: cn(iconSizes[size], 'text-gray-400')
            })}
          </div>
        )}

        <input
          ref={ref}
          type={inputType}
          className={inputClasses}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {icon && iconPosition === 'right' && !showPasswordToggle && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {React.cloneElement(icon, {
              className: cn(iconSizes[size], 'text-gray-400')
            })}
          </div>
        )}

        {type === 'password' && showPasswordToggle && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className={cn(iconSizes[size], 'text-gray-400 hover:text-gray-600')} />
            ) : (
              <Eye className={cn(iconSizes[size], 'text-gray-400 hover:text-gray-600')} />
            )}
          </button>
        )}

        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className={cn(iconSizes[size], 'text-red-500')} />
          </div>
        )}

        {success && !error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <CheckCircle className={cn(iconSizes[size], 'text-green-500')} />
          </div>
        )}
      </div>

      {(error || success || helperText) && (
        <div className="mt-2">
          {error && (
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {error}
            </p>
          )}
          {success && !error && (
            <p className="text-sm text-green-600 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              {success}
            </p>
          )}
          {helperText && !error && !success && (
            <p className="text-sm text-gray-500">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export const SearchInput = forwardRef(({ placeholder = "Tìm kiếm...", ...props }, ref) => (
  <Input
    ref={ref}
    type="search"
    icon={<Search />}
    iconPosition="left"
    placeholder={placeholder}
    {...props}
  />
));

export const PasswordInput = forwardRef(({ ...props }, ref) => (
  <Input
    ref={ref}
    type="password"
    showPasswordToggle
    {...props}
  />
));

export default Input;