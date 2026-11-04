import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

import useAuth from "../hooks/useAuth";
import UserDropdown from "./UserDropdown";
import Logo from "./Logo";

import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/cars", label: "Cars" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [theme, setTheme] = useState("light");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";

    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu after route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Preserve original navigation conditions
  const allLinks = [
    ...navLinks,
    ...(user ? [{ to: "/be-a-rider", label: "Be a Rider" }] : []),
    { to: "/dashboard", label: "Dashboard" },
  ];

  // Desktop navigation styles
  const desktopLinkClass = ({ isActive }) =>
    `relative px-3.5 py-2 text-sm font-semibold whitespace-nowrap
    transition-colors duration-300
    after:content-[''] after:absolute after:left-3 after:right-3
    after:bottom-0 after:h-[2px] after:rounded-full
    after:bg-primary after:origin-center
    after:transition-transform after:duration-300
    ${
      isActive
        ? "text-primary after:scale-x-100"
        : "text-base-content/70 after:scale-x-0 hover:text-primary hover:after:scale-x-100"
    }`;

  // Mobile navigation styles
  const mobileLinkClass = ({ isActive }) =>
    `relative flex items-center px-4 py-3 rounded-xl
    text-sm font-semibold transition-all duration-200
    ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-base-content/75 hover:bg-base-content/5 hover:text-primary"
    }`;

  return (
    <>
      {/* Floating Navbar */}
      <motion.header
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="fixed top-3 left-0 right-0 z-50 w-full px-3 sm:px-5 bg-transparent"
      >
        {/* Glass Container */}
        <div
          className={`
            relative mx-auto max-w-7xl
            overflow-visible
            rounded-2xl sm:rounded-[22px]
            border
            backdrop-blur-2xl backdrop-saturate-150
            transition-all duration-500
            ${
              theme === "light"
                ? "bg-white/65 border-white/50 shadow-[0_8px_35px_rgba(15,23,42,0.10)]"
                : "bg-slate-950/65 border-white/10 shadow-[0_8px_35px_rgba(0,0,0,0.30)]"
            }
            ${
              scrolled
                ? theme === "light"
                  ? "shadow-[0_12px_40px_rgba(15,23,42,0.14)]"
                  : "shadow-[0_12px_40px_rgba(0,0,0,0.40)]"
                : ""
            }
          `}
        >
          {/* Main Navbar */}
          <nav className="flex h-17 items-center justify-between gap-3 px-4 sm:px-6 lg:px-7">
            {/* Original Logo */}
            <div className="shrink-0">
              <Logo size="md" />
            </div>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center justify-center gap-1">
              {allLinks.map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink to={to} end={end} className={desktopLinkClass}>
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Right Actions */}
            <div className="flex shrink-0 items-center gap-2">
              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-xl border border-base-content/10
                  bg-base-content/4
                  text-base-content/70
                  transition-all duration-300
                  hover:border-primary/30 hover:bg-primary/10
                  hover:text-primary active:scale-95
                "
              >
                <motion.span
                  key={theme}
                  initial={{
                    opacity: 0,
                    rotate: -45,
                    scale: 0.7,
                  }}
                  animate={{
                    opacity: 1,
                    rotate: 0,
                    scale: 1,
                  }}
                  transition={{ duration: 0.25 }}
                >
                  {theme === "light" ? (
                    <FaMoon size={15} />
                  ) : (
                    <FaSun size={16} />
                  )}
                </motion.span>
              </button>

              {/* Authentication */}
              {user ? (
                <UserDropdown />
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="
                      flex h-10 items-center justify-center
                      rounded-xl px-4
                      border border-base-content/10
                      text-sm font-semibold text-base-content
                      transition-all duration-300
                      hover:border-primary/30 hover:bg-primary/5
                      hover:text-primary
                    "
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/register"
                    className="
                      flex h-10 items-center justify-center
                      rounded-xl px-5
                      bg-primary text-primary-content
                      text-sm font-bold
                      shadow-sm shadow-primary/20
                      transition-all duration-300
                      hover:-translate-y-0.5
                      hover:shadow-md hover:shadow-primary/25
                      active:translate-y-0
                    "
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                className="
                  flex lg:hidden h-10 w-10 items-center justify-center
                  rounded-xl border border-base-content/10
                  bg-base-content/4
                  text-base-content/80
                  transition-all duration-300
                  hover:border-primary/30 hover:bg-primary/10
                  hover:text-primary active:scale-95
                "
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={mobileOpen ? "close" : "menu"}
                    initial={{
                      opacity: 0,
                      rotate: -90,
                      scale: 0.7,
                    }}
                    animate={{
                      opacity: 1,
                      rotate: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      rotate: 90,
                      scale: 0.7,
                    }}
                    transition={{ duration: 0.18 }}
                  >
                    {mobileOpen ? <FaTimes size={17} /> : <FaBars size={17} />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </nav>

          {/* Mobile Navigation */}
          <AnimatePresence initial={false}>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  duration: 0.28,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  lg:hidden overflow-hidden
                  border-t border-base-content/10
                "
              >
                <motion.div
                  initial={{ y: -8 }}
                  animate={{ y: 0 }}
                  exit={{ y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="px-3 py-3 sm:px-5"
                >
                  <ul className="flex flex-col gap-1">
                    {allLinks.map(({ to, label, end }) => (
                      <li key={to}>
                        <NavLink to={to} end={end} className={mobileLinkClass}>
                          {label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>

                  {/* Mobile Authentication */}
                  {!user && (
                    <div
                      className="
                        mt-3 grid grid-cols-2 gap-2
                        border-t border-base-content/10 pt-3
                      "
                    >
                      <Link
                        to="/login"
                        className="
                          flex h-11 items-center justify-center
                          rounded-xl border border-base-content/10
                          text-sm font-semibold text-base-content
                          transition-all duration-200
                          hover:border-primary/30 hover:bg-primary/5
                          hover:text-primary
                        "
                      >
                        Sign In
                      </Link>

                      <Link
                        to="/register"
                        className="
                          flex h-11 items-center justify-center
                          rounded-xl bg-primary
                          text-sm font-bold text-primary-content
                          shadow-sm shadow-primary/20
                          transition-all duration-200
                          hover:opacity-90 active:scale-[0.98]
                        "
                      >
                        Get Started
                      </Link>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
};

export default Navbar;
