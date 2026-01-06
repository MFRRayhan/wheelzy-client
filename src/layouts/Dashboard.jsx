import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router";
import { IoHomeOutline } from "react-icons/io5";
import { GoGear } from "react-icons/go";
import useRole from "../hooks/useRole";
import Loader from "../components/Loader";
import { VscSettings } from "react-icons/vsc";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { Link } from "react-router";
import {
  MdEventAvailable,
  MdAddBusiness,
  MdPendingActions,
  MdEvent,
} from "react-icons/md";
import { TiGroup } from "react-icons/ti";
import { LuNotebook } from "react-icons/lu";
import { PiUsersFourFill } from "react-icons/pi";
import {
  FaUsers,
  FaRegCalendarCheck,
  FaClipboardList,
  FaMoneyCheckAlt,
  FaUserShield,
  FaUser,
  FaCalendarAlt,
  FaUserCheck,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { FaToggleOn } from "react-icons/fa";
import { FaToggleOff } from "react-icons/fa";
import UserDropdown from "../components/UserDropdown";
import Logo from "../components/logo";
import dashLogo from "/clubsphere-logo.png";
import { GiCarWheel } from "react-icons/gi";

const Dashboard = () => {
  const { role, roleLoading } = useRole();
  const [theme, setTheme] = useState("light");

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

  if (roleLoading) {
    return <Loader></Loader>;
  }
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <nav className="navbar w-full bg-base-300 px-4">
          {/* LEFT */}
          <div className="navbar-start">
            <label
              htmlFor="my-drawer-4"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
                className="my-1.5 inline-block size-4"
              >
                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
                <path d="M9 4v16" />
                <path d="M14 10l2 2l-2 2" />
              </svg>
            </label>
            <h3 className="text-primary font-bold text-2xl">Dashboard</h3>
          </div>

          {/* RIGHT */}
          <div className="navbar-end flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-circle text-xl"
              title="Toggle Dark / Light Mode"
            >
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </button>

            <UserDropdown />
          </div>
        </nav>

        {/* Page content here */}
        <div className="p-4">
          <Outlet></Outlet>
        </div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          {/* Sidebar content here */}
          <ul className="dashboard-sidebar menu w-full grow space-y-2">
            {/* List item */}
            <li>
              <NavLink
                end
                to="/"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Go Back Home"
              >
                <GiCarWheel className="size-4 my-1.5 inline-block" />
                <span className="is-drawer-close:hidden -ml-1 text-primary font-bold text-xl">
                  Wheelzy
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                end
                to="/dashboard"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Homepage"
              >
                {/* Home icon */}
                <IoHomeOutline className="my-1.5 inline-block size-4"></IoHomeOutline>
                <span className="is-drawer-close:hidden">Homepage</span>
              </NavLink>
            </li>
            {role === "admin" && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/manage-users"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Manage Users"
                  >
                    <FaUserShield className="my-1.5 inline-block size-4"></FaUserShield>
                    <span className="is-drawer-close:hidden">Manage Users</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/manage-cars"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Manage Cars"
                  >
                    <FaUsers className="my-1.5 inline-block size-4"></FaUsers>
                    <span className="is-drawer-close:hidden">Manage Cars</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/waiting-for-approval"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Waiting For Approval"
                  >
                    <MdPendingActions className="my-1.5 inline-block size-4"></MdPendingActions>
                    <span className="is-drawer-close:hidden">
                      Waiting For Approval
                    </span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/pending-rider-requests"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Pending Rider Requests"
                  >
                    <FaUserCheck className="my-1.5 inline-block size-4"></FaUserCheck>
                    <span className="is-drawer-close:hidden">
                      Pending Rider Requests
                    </span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/all-payments"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Payments"
                  >
                    <FaMoneyCheckAlt className="my-1.5 inline-block size-4"></FaMoneyCheckAlt>
                    <span className="is-drawer-close:hidden">Payments</span>
                  </NavLink>
                </li>
              </>
            )}

            {role === "rider" && (
              <>
                {/* My Assigned Cars */}
                <li>
                  <NavLink
                    to="/dashboard/my-managed-cars"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="My Cars"
                  >
                    <FaUsers className="my-1.5 inline-block size-4" />
                    <span className="is-drawer-close:hidden">My Cars</span>
                  </NavLink>
                </li>

                {/* Ride Requests */}
                <li>
                  <NavLink
                    to="/dashboard/ride-requests"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Ride Requests"
                  >
                    <PiUsersFourFill className="my-1.5 inline-block size-4" />
                    <span className="is-drawer-close:hidden">
                      Ride Requests
                    </span>
                  </NavLink>
                </li>

                {/* Add / Manage Car */}
                <li>
                  <NavLink
                    to="/dashboard/add-car"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Add A Car"
                  >
                    <MdAddBusiness className="my-1.5 inline-block size-4" />
                    <span className="is-drawer-close:hidden">Add Car</span>
                  </NavLink>
                </li>

                {/* Earnings / Payments */}
                <li>
                  <NavLink
                    to="/dashboard/rider-payments"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Payments"
                  >
                    <FaMoneyCheckAlt className="my-1.5 inline-block size-4" />
                    <span className="is-drawer-close:hidden">Payments</span>
                  </NavLink>
                </li>
              </>
            )}

            {role === "user" && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/my-cars"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="My Cars"
                  >
                    <FaUsers className="my-1.5 inline-block size-4"></FaUsers>
                    <span className="is-drawer-close:hidden">My Cars</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/payments"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Payments"
                  >
                    <FaMoneyCheckAlt className="my-1.5 inline-block size-4"></FaMoneyCheckAlt>
                    <span className="is-drawer-close:hidden">Payments</span>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
