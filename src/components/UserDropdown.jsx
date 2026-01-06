import React from "react";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import { Link } from "react-router";

const UserDropdown = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout()
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Logout Successful!",
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Logout Failed!",
          text: err.message,
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
      });
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full border-2 border-primary">
          <img
            className="object-top"
            referrerPolicy="no-referrer"
            alt="profile"
            src={
              user.photoURL ||
              "https://i.ibb.co.com/TM9j0Rqd/icon-7797704-640.png"
            }
          />
        </div>
      </div>

      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-xl z-1 mt-3 w-52 p-2 shadow"
      >
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </div>
  );
};

export default UserDropdown;
