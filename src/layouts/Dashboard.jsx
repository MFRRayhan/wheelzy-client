import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

import { IoHomeOutline } from "react-icons/io5";
import {
  FaBars,
  FaTimes,
  FaUserShield,
  FaUsers,
  FaUserCheck,
  FaMoneyCheckAlt,
  FaMoon,
  FaSun,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import { MdPendingActions, MdAddBusiness } from "react-icons/md";
import { PiUsersFourFill } from "react-icons/pi";
import { GiCarWheel } from "react-icons/gi";

import useRole from "../hooks/useRole";
import Loader from "../components/Loader";
import UserDropdown from "../components/UserDropdown";
import Logo from "../components/Logo";
import { BsSpeedometer } from "react-icons/bs";

// Sidebar Navigation Item
const SideNavItem = ({
  to,
  label,
  icon,
  end = false,
  collapsed,
  onNavigate,
}) => {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        onClick={onNavigate}
        title={collapsed ? label : undefined}
        className={({ isActive }) =>
          `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
          ${
            isActive
              ? "bg-primary/10 text-primary"
              : "text-base-content/65 hover:text-primary hover:bg-base-200/70"
          }`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <motion.span
                layoutId="dashboard-active-indicator"
                className="absolute left-0 top-2 bottom-2 w-0.75 rounded-full bg-primary"
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 30,
                }}
              />
            )}

            <span className="text-lg shrink-0">{icon}</span>

            {!collapsed && <span className="truncate">{label}</span>}
          </>
        )}
      </NavLink>
    </li>
  );
};

// Dashboard Component
const Dashboard = () => {
  const { role, roleLoading } = useRole();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  // Preserve Original Theme Functionality
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";

    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Original Role Labels
  const roleLabel =
    role === "admin"
      ? "Administrator"
      : role === "rider"
        ? "Car Owner"
        : "Member";

  // Sidebar Content
  const SidebarContents = ({ isMobile = false }) => {
    const isCollapsed = isMobile ? false : collapsed;

    const closeMobileMenu = () => {
      if (isMobile) {
        setMobileOpen(false);
      }
    };

    return (
      <>
        {/* Original Wheelzy Logo */}
        <div
          className={`h-19 flex items-center border-b border-base-300/70 shrink-0 ${
            isCollapsed ? "justify-center px-3" : "px-5"
          }`}
        >
          <Logo size="md" showText={!isCollapsed} className="shrink-0" />
        </div>

        {/* Role Badge */}
        {!isCollapsed && (
          <div className="px-4 py-4 border-b border-base-300/70 shrink-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-base-200/70 border border-base-300/70">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />

              <span className="text-[11px] font-semibold tracking-wide text-base-content/70">
                {roleLabel}
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1 dashboard-sidebar">
            {/* Original Homepage Link */}
            <SideNavItem
              to="/"
              label="Homepage"
              icon={<IoHomeOutline />}
              end
              collapsed={isCollapsed}
              onNavigate={closeMobileMenu}
            />

            <SideNavItem
              to="/dashboard"
              label="Dashboard"
              icon={<BsSpeedometer />}
              end
              collapsed={isCollapsed}
              onNavigate={closeMobileMenu}
            />

            {/* Original Admin Navigation */}
            {role === "admin" && (
              <>
                <li
                  className={
                    isCollapsed
                      ? "h-px bg-base-300/70 mx-2 my-3"
                      : "pt-6 pb-2 px-3"
                  }
                >
                  {!isCollapsed && (
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-base-content/40">
                      Administration
                    </span>
                  )}
                </li>

                <SideNavItem
                  to="/dashboard/manage-users"
                  label="Manage Users"
                  icon={<FaUserShield />}
                  collapsed={isCollapsed}
                  onNavigate={closeMobileMenu}
                />

                <SideNavItem
                  to="/dashboard/manage-cars"
                  label="Manage Cars"
                  icon={<FaUsers />}
                  collapsed={isCollapsed}
                  onNavigate={closeMobileMenu}
                />

                <SideNavItem
                  to="/dashboard/waiting-for-approval"
                  label="Waiting For Approval"
                  icon={<MdPendingActions />}
                  collapsed={isCollapsed}
                  onNavigate={closeMobileMenu}
                />

                <SideNavItem
                  to="/dashboard/pending-rider-requests"
                  label="Pending Rider Requests"
                  icon={<FaUserCheck />}
                  collapsed={isCollapsed}
                  onNavigate={closeMobileMenu}
                />

                <SideNavItem
                  to="/dashboard/all-payments"
                  label="Payments"
                  icon={<FaMoneyCheckAlt />}
                  collapsed={isCollapsed}
                  onNavigate={closeMobileMenu}
                />
              </>
            )}

            {/* Original Rider Navigation */}
            {role === "rider" && (
              <>
                <li
                  className={
                    isCollapsed
                      ? "h-px bg-base-300/70 mx-2 my-3"
                      : "pt-6 pb-2 px-3"
                  }
                >
                  {!isCollapsed && (
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-base-content/40">
                      Rider Management
                    </span>
                  )}
                </li>

                <SideNavItem
                  to="/dashboard/my-managed-cars"
                  label="My Cars"
                  icon={<FaUsers />}
                  collapsed={isCollapsed}
                  onNavigate={closeMobileMenu}
                />

                <SideNavItem
                  to="/dashboard/ride-requests"
                  label="Ride Requests"
                  icon={<PiUsersFourFill />}
                  collapsed={isCollapsed}
                  onNavigate={closeMobileMenu}
                />

                <SideNavItem
                  to="/dashboard/add-car"
                  label="Add Car"
                  icon={<MdAddBusiness />}
                  collapsed={isCollapsed}
                  onNavigate={closeMobileMenu}
                />

                <SideNavItem
                  to="/dashboard/rider-payments"
                  label="Payments"
                  icon={<FaMoneyCheckAlt />}
                  collapsed={isCollapsed}
                  onNavigate={closeMobileMenu}
                />
              </>
            )}

            {/* Original User Navigation */}
            {role === "user" && (
              <>
                <li
                  className={
                    isCollapsed
                      ? "h-px bg-base-300/70 mx-2 my-3"
                      : "pt-6 pb-2 px-3"
                  }
                >
                  {!isCollapsed && (
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-base-content/40">
                      My Account
                    </span>
                  )}
                </li>

                <SideNavItem
                  to="/dashboard/my-cars"
                  label="My Cars"
                  icon={<FaUsers />}
                  collapsed={isCollapsed}
                  onNavigate={closeMobileMenu}
                />

                <SideNavItem
                  to="/dashboard/payments"
                  label="Payments"
                  icon={<FaMoneyCheckAlt />}
                  collapsed={isCollapsed}
                  onNavigate={closeMobileMenu}
                />
              </>
            )}
          </ul>
        </nav>
      </>
    );
  };

  // Preserve Original Loading Behavior
  if (roleLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-base-200/50 text-base-content">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 76 : 260 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-40 bg-base-100 border-r border-base-300/70"
      >
        <SidebarContents />

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
          className="absolute -right-3 top-22 w-7 h-7 rounded-full bg-base-100 border border-base-300 shadow-sm flex items-center justify-center text-base-content/60 hover:text-primary hover:border-primary/40 transition-all duration-200"
        >
          {collapsed ? (
            <FaChevronRight size={10} />
          ) : (
            <FaChevronLeft size={10} />
          )}
        </button>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25 }}
              className="fixed inset-y-0 left-0 w-70 bg-base-100 z-50 flex flex-col shadow-2xl lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close sidebar"
                className="absolute top-5 right-4 z-10 w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center text-base-content/60 hover:text-primary transition-colors"
              >
                <FaTimes />
              </button>

              <SidebarContents isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`min-h-screen min-w-0 transition-[margin] duration-300 ${
          collapsed ? "lg:ml-19" : "lg:ml-65"
        }`}
      >
        {/* Original Dashboard Navbar */}
        <header className="sticky top-0 z-30 h-19 bg-base-100/90 backdrop-blur-xl border-b border-base-300/70 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar"
              className="lg:hidden w-10 h-10 rounded-xl bg-base-200 flex items-center justify-center text-base-content/70 hover:text-primary transition-colors"
            >
              <FaBars />
            </button>

            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight">
                Dashboard
              </h1>

              <p className="hidden sm:block text-xs text-base-content/45">
                Manage your Wheelzy experience
              </p>
            </div>
          </div>

          {/* Original Theme Toggle and UserDropdown */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              title="Toggle Dark / Light Mode"
              aria-label="Toggle theme"
              className="w-10 h-10 rounded-xl border border-base-300/70 bg-base-100 flex items-center justify-center text-base-content/60 hover:text-primary hover:border-primary/30 transition-all duration-200"
            >
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </button>

            <div className="pl-3 border-l border-base-300/70">
              <UserDropdown />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
