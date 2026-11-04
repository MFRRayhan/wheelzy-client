import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useRole from "../../hooks/useRole";
import {
  FaSearch,
  FaEye,
  FaTrash,
  FaUserShield,
  FaUserMinus,
  FaUser,
  FaTimes,
} from "react-icons/fa";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";

const roleBadge = {
  admin:
    "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
  rider: "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  user: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
};

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { role, isLoading } = useRole();
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: users = [], refetch } = useQuery({
    queryKey: ["users", searchText],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?searchText=${searchText}`);
      return res.data;
    },
  });

  if (isLoading) return <Loader fullScreen={false} />;

  if (role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-950/30 rounded-2xl flex items-center justify-center mb-4">
          <FaUserShield className="text-red-500" size={24} />
        </div>
        <p className="font-bold text-base-content text-lg">Access Denied</p>
        <p className="text-base-content/50 text-sm mt-1">
          Only administrators can manage users.
        </p>
      </div>
    );
  }

  const handleChangeRole = (user, newRole) => {
    Swal.fire({
      title: "Change Role?",
      text: `Set ${user.displayName} as ${newRole}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#e85d04",
      confirmButtonText: "Confirm",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .patch(`/users/${user._id}/role`, { role: newRole })
          .then((res) => {
            if (res.data.modifiedCount) {
              refetch();
              Swal.fire({
                icon: "success",
                title: "Role updated",
                timer: 1500,
                showConfirmButton: false,
              });
            }
          });
      }
    });
  };

  const handleDelete = (user) => {
    Swal.fire({
      title: "Delete User?",
      text: `Remove ${user.displayName} from the platform?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/users/${user._id}`).then((res) => {
          if (res.data.deletedCount) {
            refetch();
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              timer: 1500,
              showConfirmButton: false,
            });
          }
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-base-content">Manage Users</h2>
          <p className="text-sm text-base-content/50 mt-0.5">
            {users.length} registered accounts
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/30 text-sm pointer-events-none" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-base-100 border border-base-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="premium-table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td className="text-base-content/40 font-medium">
                    {index + 1}
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-base-300 flex-shrink-0">
                        <img
                          referrerPolicy="no-referrer"
                          src={user.photoURL}
                          alt={user.displayName}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <span className="font-semibold text-base-content">
                        {user.displayName}
                      </span>
                    </div>
                  </td>
                  <td className="text-base-content/60">{user.email}</td>
                  <td className="text-base-content/50 text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${
                        roleBadge[user.role] ||
                        "bg-base-200 text-base-content/60"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      {/* View */}
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="w-8 h-8 rounded-lg bg-base-200 hover:bg-primary hover:text-white flex items-center justify-center transition-all text-base-content/60"
                        title="View user"
                      >
                        <FaEye size={12} />
                      </button>

                      {/* Make Admin */}
                      {user.role !== "admin" && (
                        <button
                          onClick={() => handleChangeRole(user, "admin")}
                          className="w-8 h-8 rounded-lg bg-base-200 hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-950/30 flex items-center justify-center transition-all text-base-content/60"
                          title="Make Admin"
                        >
                          <FaUserShield size={12} />
                        </button>
                      )}

                      {/* Make Rider */}
                      {user.role !== "rider" && (
                        <button
                          onClick={() => handleChangeRole(user, "rider")}
                          className="w-8 h-8 rounded-lg bg-base-200 hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-950/30 flex items-center justify-center transition-all text-base-content/60"
                          title="Make Rider"
                        >
                          <FaUserMinus size={12} />
                        </button>
                      )}

                      {/* Make User */}
                      {user.role !== "user" && (
                        <button
                          onClick={() => handleChangeRole(user, "user")}
                          className="w-8 h-8 rounded-lg bg-base-200 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-950/30 flex items-center justify-center transition-all text-base-content/60"
                          title="Make User"
                        >
                          <FaUser size={12} />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(user)}
                        className="w-8 h-8 rounded-lg bg-base-200 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/30 flex items-center justify-center transition-all text-base-content/60"
                        title="Delete user"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User details modal */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedUser(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="bg-base-100 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden pointer-events-auto border border-base-300"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-base-200">
                  <h3 className="font-bold text-base-content">User Details</h3>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="w-8 h-8 rounded-lg hover:bg-base-200 flex items-center justify-center text-base-content/50 transition-all"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-base-300">
                      <img
                        referrerPolicy="no-referrer"
                        src={selectedUser.photoURL}
                        alt={selectedUser.displayName}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-base-content text-lg">
                        {selectedUser.displayName}
                      </p>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${
                          roleBadge[selectedUser.role] || ""
                        }`}
                      >
                        {selectedUser.role}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      { label: "Email", value: selectedUser.email },
                      {
                        label: "Joined",
                        value: new Date(
                          selectedUser.createdAt,
                        ).toLocaleDateString(),
                      },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-base-200 rounded-xl p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-0.5">
                          {label}
                        </p>
                        <p className="text-sm font-medium text-base-content">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedUser(null)}
                    className="w-full h-10 bg-base-200 hover:bg-base-300 rounded-xl text-sm font-medium text-base-content transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageUsers;
