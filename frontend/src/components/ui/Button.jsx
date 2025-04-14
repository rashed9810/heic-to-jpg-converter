import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

const Button = forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "md",
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    // Button variants
    const variants = {
      primary:
        "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 focus:ring-primary-500",
      secondary:
        "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700 focus:ring-secondary-500",
      outline:
        "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500",
      ghost:
        "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
      danger:
        "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500",
      success:
        "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 focus:ring-green-500",
    };

    // Button sizes
    const sizes = {
      sm: "py-1.5 px-3 text-sm",
      md: "py-2 px-4 text-base",
      lg: "py-2.5 px-5 text-lg",
      xl: "py-3 px-6 text-xl",
    };

    // Animation variants
    const buttonAnimation = {
      rest: { scale: 1 },
      hover: { scale: 1.03 },
      tap: { scale: 0.97 },
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "shadow-md hover:shadow-lg transition-shadow",
          variants[variant],
          sizes[size],
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className
        )}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        variants={buttonAnimation}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        disabled={disabled}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
