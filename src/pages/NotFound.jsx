import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { FaHome, FaArrowRight } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center px-4 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        {/* Animated number */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6"
        >
          <span className="text-[8rem] font-extrabold leading-none text-gradient">
            404
          </span>
        </motion.div>

        <h1 className="text-2xl font-extrabold text-base-content mb-3">
          Page not found
        </h1>
        <p className="text-base-content/50 text-sm leading-relaxed mb-8">
          The page you're looking for has been removed, renamed, or is
          temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-primary text-primary-content font-semibold px-7 py-3 rounded-xl hover:opacity-90 transition-all shadow-sm hover:shadow-md"
            >
              <FaHome size={14} />
              Back to Home
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/cars"
              className="flex items-center justify-center gap-2 border border-base-300 text-base-content font-medium px-7 py-3 rounded-xl hover:bg-base-200 transition-all"
            >
              Browse Cars
              <FaArrowRight size={12} />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
