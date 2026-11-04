import React from "react";
import { motion } from "framer-motion";

const Loader = ({ fullScreen = true, message = "" }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${
        fullScreen ? "h-screen" : "py-20"
      }`}
    >
      {/* Animated wheel */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12"
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="3"
            className="text-base-300"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="40 88"
            strokeLinecap="round"
            className="text-primary"
          />
          <circle
            cx="24"
            cy="24"
            r="6"
            fill="currentColor"
            className="text-primary"
          />
          {/* Spokes */}
          <line
            x1="24"
            y1="4"
            x2="24"
            y2="18"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="text-primary/60"
          />
          <line
            x1="24"
            y1="30"
            x2="24"
            y2="44"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="text-primary/60"
          />
          <line
            x1="4"
            y1="24"
            x2="18"
            y2="24"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="text-primary/60"
          />
          <line
            x1="30"
            y1="24"
            x2="44"
            y2="24"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="text-primary/60"
          />
        </svg>
      </motion.div>

      {message && (
        <p className="text-sm text-base-content/50 font-medium">{message}</p>
      )}
    </div>
  );
};

export default Loader;
