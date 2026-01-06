// pages/NotFound.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
      {/* Animated 404 Number */}
      <motion.h1
        initial={{ scale: 0 }}
        animate={{ rotate: 360, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="text-9xl font-extrabold text-primary mb-6"
      >
        404
      </motion.h1>

      {/* Animated Message */}
      <motion.p
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-2xl md:text-3xl font-semibold mb-4 text-gray-700"
      >
        Oops! Page Not Found
      </motion.p>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="text-gray-500 mb-6"
      >
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </motion.p>

      {/* Back Home Button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link to="/" className="btn btn-primary px-6 py-3 font-semibold">
          Go Back Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
