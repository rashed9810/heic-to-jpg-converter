import { cn } from '../../utils/cn';

const Spinner = ({ className, size = 'md', ...props }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-3',
    xl: 'h-12 w-12 border-4',
  };

  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-solid border-current border-t-transparent text-primary-600',
        sizes[size],
        className
      )}
      role="status"
      aria-label="loading"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
