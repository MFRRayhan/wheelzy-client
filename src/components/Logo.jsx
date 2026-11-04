import React from "react";
import { Link } from "react-router";
import { GiCartwheel } from "react-icons/gi";

const Logo = ({ size = "md", showText = true, className = "" }) => {
  const sizeMap = {
    sm: { icon: "w-6 h-6", text: "text-lg" },
    md: { icon: "w-8 h-8", text: "text-xl" },
    lg: { icon: "w-10 h-10", text: "text-2xl" },
  };

  const { icon, text } = sizeMap[size] || sizeMap.md;

  return (
    <Link
      className={`inline-flex items-center gap-2.5 group ${className}`}
      to="/"
    >
      {/* Custom wheel mark */}
      <div
        className={`${icon} relative shrink-0 rounded-full bg-primary flex items-center justify-center shadow-sm group-hover:shadow-primary/40 transition-shadow duration-300`}
      >
        {/* Outer ring */}
        <GiCartwheel className="text-white size-7" />
      </div>

      {showText && (
        <span
          className={`${text} font-extrabold tracking-tight text-base-content group-hover:text-primary transition-colors duration-200`}
        >
          Wheel<span className="text-primary">zy</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
