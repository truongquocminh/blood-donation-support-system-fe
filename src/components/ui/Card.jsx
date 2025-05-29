import React from 'react';
import { cn } from '../../utils/helpers';

const Card = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  hoverable = false,
  clickable = false,
  onClick,
  ...props
}) => {
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white shadow-lg border-0',
    outlined: 'bg-white border-2 border-gray-300 shadow-none',
    ghost: 'bg-transparent border-0 shadow-none',
    gradient: 'bg-gradient-to-br from-red-50 to-pink-50 border border-red-100 shadow-sm'
  };

  const sizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const cardClasses = cn(
    'rounded-xl transition-all duration-200',
    variants[variant],
    sizes[size],
    hoverable && 'hover:shadow-lg hover:-translate-y-1',
    clickable && 'cursor-pointer hover:shadow-lg hover:-translate-y-1',
    className
  );

  return (
    <div
      className={cardClasses}
      onClick={clickable ? onClick : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className, ...props }) => (
  <div className={cn('mb-4', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }) => (
  <h3 className={cn('text-lg font-semibold text-gray-900', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className, ...props }) => (
  <p className={cn('text-sm text-gray-600 mt-1', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className, ...props }) => (
  <div className={cn('', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }) => (
  <div className={cn('mt-4 pt-4 border-t border-gray-200', className)} {...props}>
    {children}
  </div>
);

export const StatsCard = ({ 
  icon: Icon, 
  title, 
  value, 
  change, 
  trend = 'up',
  className,
  ...props 
}) => (
  <Card className={cn('hover:shadow-lg transition-shadow', className)} {...props}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <div className={cn(
            'flex items-center mt-2 text-sm',
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          )}>
            <span>{change}</span>
          </div>
        )}
      </div>
      {Icon && (
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-red-600" />
        </div>
      )}
    </div>
  </Card>
);

export const InfoCard = ({ 
  icon: Icon, 
  title, 
  description, 
  color = 'red',
  className,
  ...props 
}) => {
  const colorClasses = {
    red: 'from-red-500 to-pink-500',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-violet-500',
    orange: 'from-orange-500 to-red-500',
    teal: 'from-teal-500 to-blue-500'
  };

  return (
    <Card className={cn('hover:shadow-lg transition-shadow', className)} hoverable {...props}>
      <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[color]} rounded-xl flex items-center justify-center mb-4`}>
        {Icon && <Icon className="w-6 h-6 text-white" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </Card>
  );
};

export const ActionCard = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  actionText = "Xem thêm",
  className,
  ...props 
}) => (
  <Card className={cn('hover:shadow-lg transition-shadow', className)} hoverable {...props}>
    <div className="flex items-start space-x-4">
      {Icon && (
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-red-600" />
        </div>
      )}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        {action && (
          <button
            onClick={action}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  </Card>
);

export const ImageCard = ({ 
  src, 
  alt, 
  title, 
  description, 
  className,
  ...props 
}) => (
  <Card className={cn('overflow-hidden hover:shadow-lg transition-shadow', className)} hoverable {...props}>
    <div className="aspect-w-16 aspect-h-9 mb-4">
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-48 object-cover rounded-t-xl"
      />
    </div>
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </Card>
);

export default Card;