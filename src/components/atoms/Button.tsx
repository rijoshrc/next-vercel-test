import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  size: "md" | "lg" | "sm";
  variant: "primary" | "secondary" | "link" | "success" | "error";
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  loading,
  disabled,
  ...props
}) => {
  return (
    <button {...props} disabled={disabled || loading}>
      {loading ? "Loading.." : children}
    </button>
  );
};

export default Button;
