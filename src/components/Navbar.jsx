import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import useAuth from "../hooks/useAuth";
import UserDropdown from "./UserDropdown";
import Logo from "./logo";
import { FaSun, FaMoon } from "react-icons/fa";

const Navbar = () => {
  const { user } = useAuth();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    // DaisyUI requires data-theme attribute on html or body
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const links = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/cars">Cars</NavLink>
      </li>
      <li>
        <NavLink to="/about">About</NavLink>
      </li>
      <li>
        <NavLink to="/services">Services</NavLink>
      </li>
      {user && (
        <>
          <li>
            <NavLink to="/be-a-rider">Be a Rider</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="sticky bg-base-100 top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="container mx-auto">
        <div className="navbar px-0">
          {/* Left - Logo + Mobile Menu */}
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>

              <ul
                tabIndex="-1"
                className="primary-menu menu menu-sm dropdown-content bg-base-100 dark:bg-gray-800 rounded-box z-10 mt-3 w-52 p-2 shadow"
              >
                {links}
              </ul>
            </div>

            <Logo />
          </div>

          {/* Center - Desktop Menu */}
          <div className="navbar-center hidden lg:flex">
            <ul className="primary-menu menu menu-horizontal px-1 space-x-2">
              {links}
            </ul>
          </div>

          {/* Right — Buttons & Avatar Dropdown */}
          <div className="navbar-end flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-circle text-xl"
              title="Toggle Dark/Light Mode"
            >
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </button>

            {/* User Authentication */}
            {user ? (
              <UserDropdown />
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-primary">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-outline btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
