import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import Swal from "sweetalert2";

import {
  FaUser,
  FaThLarge,
  FaSignOutAlt,
  FaChevronDown,
  FaShieldAlt,
} from "react-icons/fa";

const DEFAULT_AVATAR = "https://i.ibb.co.com/TM9j0Rqd/icon-7797704-640.png";

const UserDropdown = () => {
  const { user, logout } = useAuth();
  const { role, roleLoading } = useRole();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
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

        navigate("/login");
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

  const formattedRole = roleLoading
    ? "Loading..."
    : role.charAt(0).toUpperCase() + role.slice(1);

  const menuItems = [
    {
      to: "/profile",
      label: "Profile",
      icon: <FaUser size={13} />,
    },
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <FaThLarge size={13} />,
    },
  ];

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="group flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-2.5 transition-all duration-200 hover:bg-base-200"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-xl ring-2 ring-primary/20 transition-all duration-200 group-hover:ring-primary/50">
          <img
            key={user.photoURL || DEFAULT_AVATAR}
            referrerPolicy="no-referrer"
            src={user.photoURL || DEFAULT_AVATAR}
            alt={user.displayName || "User"}
            className="h-full w-full object-cover object-top"
          />
        </div>

        {/* Name and Role */}
        <div className="hidden min-w-0 text-left sm:block">
          <p className="max-w-28 truncate text-sm font-semibold leading-tight text-base-content">
            {user.displayName?.split(" ")[0] || "Account"}
          </p>

          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
            {formattedRole}
          </p>
        </div>

        <FaChevronDown
          size={11}
          className={`shrink-0 text-base-content/50 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
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
            className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-base-200 bg-base-100 shadow-xl"
          >
            {/* User Info Header */}
            <div className="flex items-center gap-3 border-b border-base-200 px-4 py-4">
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl ring-2 ring-primary/20">
                <img
                  key={user.photoURL || DEFAULT_AVATAR}
                  referrerPolicy="no-referrer"
                  src={user.photoURL || DEFAULT_AVATAR}
                  alt={user.displayName || "User"}
                  className="h-full w-full object-cover object-top"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-base-content">
                  {user.displayName || "User"}
                </p>

                <p className="mt-0.5 truncate text-xs text-base-content/50">
                  {user.email}
                </p>

                <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                  <FaShieldAlt size={9} />
                  {formattedRole}
                </span>
              </div>
            </div>

            {/* Menu Items */}
            <ul className="space-y-0.5 px-1.5 py-2">
              {menuItems.map(({ to, label, icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-base-content transition-all duration-150 hover:bg-base-200 hover:text-primary"
                  >
                    <span className="text-primary/70">{icon}</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Logout */}
            <div className="mx-1.5 border-t border-base-200 px-0 pb-1.5 pt-1.5">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-error transition-all duration-150 hover:bg-error/10"
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
