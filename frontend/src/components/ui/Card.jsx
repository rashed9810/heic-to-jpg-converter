import { cn } from '../../utils/cn';

const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-soft-xl overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('px-6 py-4 border-b border-gray-100', className)}
      {...props}
    >
      {children}
    </div>
  );
};

const CardTitle = ({ className, children, ...props }) => {
  return (
    <h3
      className={cn('text-xl font-semibold text-gray-800', className)}
      {...props}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({ className, children, ...props }) => {
  return (
    <p
      className={cn('mt-1 text-sm text-gray-500', className)}
      {...props}
    >
      {children}
    </p>
  );
};

const CardContent = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('px-6 py-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};

const CardFooter = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('px-6 py-4 bg-gray-50', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
