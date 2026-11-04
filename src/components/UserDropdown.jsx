import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import { FaUser, FaThLarge, FaSignOutAlt, FaChevronDown } from "react-icons/fa";

const UserDropdown = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout()
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Signed out",
          text: "See you next time!",
          timer: 2000,
          showConfirmButton: false,
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Sign out failed",
          text: err.message,
        });
      });
  };

  if (!user) return null;

  const menuItems = [
    { to: "/profile", label: "Profile", icon: <FaUser size={13} /> },
    { to: "/dashboard", label: "Dashboard", icon: <FaThLarge size={13} /> },
  ];

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 h-10 pl-1 pr-3 rounded-xl hover:bg-base-200 transition-all duration-200 group"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-lg overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
          <img
            referrerPolicy="no-referrer"
            src={
              user.photoURL ||
              "https://i.ibb.co.com/TM9j0Rqd/icon-7797704-640.png"
            }
            alt={user.displayName || "User"}
            className="w-full h-full object-cover object-top"
          />
        </div>
        <span className="hidden sm:block text-sm font-medium text-base-content max-w-24 truncate">
          {user.displayName?.split(" ")[0] || "Account"}
        </span>
        <FaChevronDown
          size={11}
          className={`text-base-content/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-52 bg-base-100 rounded-2xl shadow-xl border border-base-200 overflow-hidden z-50"
          >
            {/* User info header */}
            <div className="px-4 py-3 border-b border-base-200">
              <p className="text-sm font-semibold text-base-content truncate">
                {user.displayName || "User"}
              </p>
              <p className="text-xs text-base-content/50 truncate">
                {user.email}
              </p>
            </div>

            {/* Menu items */}
            <ul className="py-1.5 px-1.5">
              {menuItems.map(({ to, label, icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-base-content hover:bg-base-200 hover:text-primary transition-all duration-150"
                  >
                    <span className="text-primary/70">{icon}</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Logout */}
            <div className="px-1.5 pb-1.5 border-t border-base-200 mt-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-150"
              >
                <FaSignOutAlt size={13} />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDropdown;
