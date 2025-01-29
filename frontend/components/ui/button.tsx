import React from "react";
import { cn } from "../../utils/cn";
import { Loader2 } from "lucide-react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "danger";
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  loading = false,
  className,
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-lg font-medium flex items-center justify-center transition duration-200 focus:outline-none";

  const variantStyles = {
    primary: "bg-rose-600 text-white hover:bg-rose-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    outline: "border border-gray-500 text-gray-700 hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
