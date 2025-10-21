import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo: React.FC<LogoProps> = ({ className = "", size = "md" }) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div
        className={`${sizeClasses[size]} bg-primary rounded-lg flex items-center justify-center text-primary-content font-bold`}
      >
        C
      </div>
    </div>
  );
};

export default Logo;
