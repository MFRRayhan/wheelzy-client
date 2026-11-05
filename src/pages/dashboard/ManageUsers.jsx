import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  FaSearch,
  FaEye,
  FaTrash,
  FaUserShield,
  FaUserMinus,
  FaUser,
  FaTimes,
  FaUsers,
  FaUserCheck,
  FaUserCog,
  FaCalendarAlt,
  FaEnvelope,
  FaSyncAlt,
  FaExclamationCircle,
  FaChevronRight,
} from "react-icons/fa";
import Swal from "sweetalert2";

import useAxiosSecure from "../../hooks/useAxiosSecure";
import useRole from "../../hooks/useRole";
import Loader from "../../components/Loader";

const BRAND = "#0F766E";

const roleConfig = {
  admin: {
    label: "Admin",
    icon: FaUserShield,
    badge: "bg-primary/10 text-primary border-primary/15",
  },
  rider: {
    label: "Rider",
    icon: FaUserMinus,
    badge:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/15",
  },
  user: {
    label: "User",
    icon: FaUser,
    badge: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/15",
  },
};

const formatDate = (date) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Not available";

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name = "") => {
  const words = name
    .trim()
    .split(/[\s._-]+/)
    .filter(Boolean);

  if (!words.length) return "U";

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

const getDisplayName = (user) => {
  return user?.displayName || user?.email?.split("@")[0] || "Unknown User";
};

const Avatar = ({ user, size = "normal" }) => {
  const [imageError, setImageError] = useState(false);

  const dimension =
    size === "large" ? "w-20 h-20 rounded-2xl" : "w-10 h-10 rounded-xl";

  const photoURL = user?.photoURL;

  return (
    <div
      className={`${dimension} shrink-0 overflow-hidden border border-base-300 bg-base-200 flex items-center justify-center`}
    >
      {photoURL && !imageError ? (
        <img
          src={photoURL}
          alt={getDisplayName(user)}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-top"
        />
      ) : (
        <span
          className="font-bold text-primary"
          style={{ fontSize: size === "large" ? "24px" : "13px" }}
        >
          {getInitials(getDisplayName(user))}
        </span>
      )}
    </div>
  );
};

const RoleBadge = ({ role }) => {
  const config = roleConfig[role] || {
    label: role || "Unknown",
    icon: FaUser,
  };

  const Icon = config.icon;

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-base-300 bg-base-200 text-primary text-[11px] font-bold capitalize">
      <Icon size={10} />
      {config.label}
    </span>
  );
};

const ActionButton = ({ title, onClick, children, variant = "default" }) => {
  const variants = {
    default:
      "bg-base-200 text-base-content/60 hover:bg-primary hover:text-white",
    admin:
      "bg-base-200 text-base-content/60 hover:bg-primary/10 hover:text-primary",
    rider:
      "bg-base-200 text-base-content/60 hover:bg-primary/10 hover:text-primary",
    user: "bg-base-200 text-base-content/60 hover:bg-primary/10 hover:text-primary",
    delete:
      "bg-base-200 text-base-content/60 hover:bg-red-500 hover:text-white",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

const SummaryCard = ({ title, count, icon: Icon, description }) => (
  <div className="relative overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
    <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-primary/5" />

    <div className="relative flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-base-content/50">{title}</p>

        <p className="mt-2 text-2xl font-bold tracking-tight text-base-content">
          {count}
        </p>

        <p className="mt-1 text-[11px] text-base-content/40">{description}</p>
      </div>

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon size={17} />
      </div>
    </div>
  </div>
);

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { role, isLoading: roleLoading } = useRole();

  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const {
    data: users = [],
    refetch,
    isLoading: usersLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", searchText],
    queryFn: async () => {
      const res = await axiosSecure.get("/users", {
        params: { searchText },
      });

      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: role === "admin",
  });

  const adminCount = users.filter((user) => user.role === "admin").length;

  const riderCount = users.filter((user) => user.role === "rider").length;

  const regularUserCount = users.filter((user) => user.role === "user").length;

  const handleChangeRole = async (user, newRole) => {
    const displayName = getDisplayName(user);

    const result = await Swal.fire({
      title: "Change account role?",
      html: `
        <div style="font-size: 14px; color: #777;">
          You are about to change
          <strong>${displayName}</strong>'s role to
          <strong style="text-transform: capitalize;">${newRole}</strong>.
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: BRAND,
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, change role",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl px-5",
        cancelButton: "rounded-xl px-5",
      },
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(`/users/${user._id}/role`, {
        role: newRole,
      });

      if (res.data.modifiedCount || res.data.matchedCount) {
        await refetch();

        if (selectedUser?._id === user._id) {
          setSelectedUser((previous) =>
            previous ? { ...previous, role: newRole } : null,
          );
        }

        Swal.fire({
          icon: "success",
          title: "Role updated",
          text: `${displayName} is now ${newRole}.`,
          timer: 1800,
          showConfirmButton: false,
          customClass: { popup: "rounded-2xl" },
        });
      } else {
        Swal.fire({
          icon: "info",
          title: "No changes made",
          text: "The account role was not changed.",
          confirmButtonColor: BRAND,
          customClass: { popup: "rounded-2xl" },
        });
      }
    } catch (err) {
      console.error("Role update error:", err);

      Swal.fire({
        icon: "error",
        title: "Update failed",
        text:
          err.response?.data?.message ||
          "Unable to update this user's role. Please try again.",
        confirmButtonColor: BRAND,
        customClass: { popup: "rounded-2xl" },
      });
    }
  };

  const handleDelete = async (user) => {
    const displayName = getDisplayName(user);

    const result = await Swal.fire({
      title: "Delete this account?",
      html: `
        <div style="font-size: 14px; color: #777;">
          <strong>${displayName}</strong> will be removed from the platform.
          This action cannot be undone.
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Delete account",
      cancelButtonText: "Keep account",
      reverseButtons: true,
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl px-5",
        cancelButton: "rounded-xl px-5",
      },
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(`/users/${user._id}`);

      if (res.data.deletedCount) {
        await refetch();

        if (selectedUser?._id === user._id) {
          setSelectedUser(null);
        }

        Swal.fire({
          icon: "success",
          title: "Account deleted",
          text: `${displayName} has been removed.`,
          timer: 1800,
          showConfirmButton: false,
          customClass: { popup: "rounded-2xl" },
        });
      } else {
        Swal.fire({
          icon: "info",
          title: "Account not deleted",
          text: "No account was removed.",
          confirmButtonColor: BRAND,
          customClass: { popup: "rounded-2xl" },
        });
      }
    } catch (err) {
      console.error("Delete user error:", err);

      Swal.fire({
        icon: "error",
        title: "Deletion failed",
        text:
          err.response?.data?.message ||
          "Unable to delete this account. Please try again.",
        confirmButtonColor: BRAND,
        customClass: { popup: "rounded-2xl" },
      });
    }
  };

  if (roleLoading) {
    return <Loader fullScreen={false} />;
  }

  if (role !== "admin") {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-base-300 bg-base-100 px-5 text-center shadow-sm">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
          <FaUserShield size={26} />
        </div>

        <h2 className="text-xl font-bold text-base-content">Access Denied</h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-base-content/50">
          You don't have permission to access user management. This section is
          available to administrators only.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end"
      >
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              Administration
            </p>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
            Manage Users
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-base-content/50">
            Manage platform accounts, review user information, and control
            account permissions from one place.
          </p>
        </div>

        <div className="flex w-full items-center gap-3 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-sm sm:w-auto">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FaUsers size={17} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40">
              Matching accounts
            </p>
            <p className="text-lg font-bold leading-tight text-base-content">
              {users.length}
              <span className="ml-1 text-xs font-medium text-base-content/40">
                users
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh users"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-base-200 text-base-content/60 transition-all hover:bg-primary hover:text-white disabled:opacity-50"
          >
            <FaSyncAlt size={13} className={isFetching ? "animate-spin" : ""} />
          </button>
        </div>
      </motion.div>

      {/* Summary cards */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.07 } },
        }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {[
          {
            title: "Total Accounts",
            count: users.length,
            icon: FaUsers,
            description: "Matching search results",
          },
          {
            title: "Administrators",
            count: adminCount,
            icon: FaUserShield,
            description: "Accounts with admin access",
          },
          {
            title: "Riders",
            count: riderCount,
            icon: FaUserCheck,
            description: "Registered rider accounts",
          },
          {
            title: "Regular Users",
            count: regularUserCount,
            icon: FaUser,
            description: "Standard customer accounts",
          },
        ].map((item) => (
          <motion.div
            key={item.title}
            variants={{
              hidden: { opacity: 0, y: 14 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.35 },
              },
            }}
          >
            <SummaryCard {...item} />
          </motion.div>
        ))}
      </motion.div>

      {/* User directory */}
      <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        {/* Directory header */}
        <div className="flex flex-col gap-4 border-b border-base-200 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FaUserCog size={15} />
              </div>

              <div>
                <h2 className="text-base font-bold text-base-content">
                  User Directory
                </h2>
                <p className="mt-0.5 text-xs text-base-content/45">
                  View and manage registered accounts
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full lg:max-w-xs">
            <FaSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-base-content/35" />

            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by name or email..."
              aria-label="Search users by name or email"
              className="h-11 w-full rounded-xl border border-base-300 bg-base-200/50 pl-10 pr-10 text-sm text-base-content outline-none transition-all placeholder:text-base-content/35 focus:border-primary focus:bg-base-100 focus:ring-4 focus:ring-primary/10"
            />

            {searchText && (
              <button
                type="button"
                onClick={() => setSearchText("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 transition-colors hover:text-base-content"
              >
                <FaTimes size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Table status */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-base-200 bg-base-200/30 px-4 py-3 sm:px-5">
          <p className="text-xs text-base-content/50">
            Showing{" "}
            <span className="font-bold text-base-content">{users.length}</span>{" "}
            {users.length === 1 ? "account" : "accounts"}
          </p>

          <div className="flex items-center gap-2 text-[11px] font-medium text-base-content/40">
            {isFetching && (
              <>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                Updating results...
              </>
            )}
          </div>
        </div>

        {/* Loading */}
        {usersLoading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Loader fullScreen={false} />
          </div>
        ) : isError ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <FaExclamationCircle size={22} />
            </div>

            <h3 className="font-bold text-base-content">
              Unable to load users
            </h3>

            <p className="mt-2 max-w-sm text-sm text-base-content/50">
              {error?.response?.data?.message ||
                "Something went wrong while loading user accounts."}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition-all hover:brightness-95"
              style={{ backgroundColor: BRAND }}
            >
              <FaSyncAlt size={12} />
              Try again
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FaSearch size={23} />
            </div>

            <h3 className="font-bold text-base-content">No users found</h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-base-content/50">
              {searchText
                ? `No accounts match "${searchText}". Try another name or email address.`
                : "There are no registered accounts to display yet."}
            </p>

            {searchText && (
              <button
                type="button"
                onClick={() => setSearchText("")}
                className="mt-4 rounded-xl px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="premium-table w-full min-w-[850px]">
              <thead>
                <tr>
                  <th className="w-14">No.</th>
                  <th>User</th>
                  <th>Email Address</th>
                  <th>Joined Date</th>
                  <th>Account Role</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence mode="popLayout">
                  {users.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td>
                        <span className="text-xs font-semibold tabular-nums text-base-content/35">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </td>

                      {/* User */}
                      <td>
                        <div className="flex min-w-[190px] items-center gap-3">
                          <Avatar user={user} />

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-base-content">
                              {getDisplayName(user)}
                            </p>
                            <p className="mt-0.5 text-[10px] text-base-content/40">
                              Platform account
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td>
                        <div className="flex min-w-[190px] items-center gap-2 text-sm text-base-content/60">
                          <FaEnvelope
                            size={11}
                            className="shrink-0 text-primary"
                          />
                          <span className="truncate">
                            {user.email || "No email"}
                          </span>
                        </div>
                      </td>

                      {/* Joined */}
                      <td>
                        <div className="flex items-center gap-2 whitespace-nowrap text-xs text-base-content/50">
                          <FaCalendarAlt size={11} className="text-primary" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>

                      {/* Role */}
                      <td>
                        <RoleBadge role={user.role} />
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="flex items-center justify-end gap-1.5">
                          <ActionButton
                            title="View user details"
                            onClick={() => setSelectedUser(user)}
                          >
                            <FaEye size={13} />
                          </ActionButton>

                          {user.role !== "admin" && (
                            <ActionButton
                              title="Make administrator"
                              variant="admin"
                              onClick={() => handleChangeRole(user, "admin")}
                            >
                              <FaUserShield size={13} />
                            </ActionButton>
                          )}

                          {user.role !== "rider" && (
                            <ActionButton
                              title="Make rider"
                              variant="rider"
                              onClick={() => handleChangeRole(user, "rider")}
                            >
                              <FaUserMinus size={13} />
                            </ActionButton>
                          )}

                          {user.role !== "user" && (
                            <ActionButton
                              title="Make regular user"
                              variant="user"
                              onClick={() => handleChangeRole(user, "user")}
                            >
                              <FaUser size={13} />
                            </ActionButton>
                          )}

                          <ActionButton
                            title="Delete user"
                            variant="delete"
                            onClick={() => handleDelete(user)}
                          >
                            <FaTrash size={12} />
                          </ActionButton>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {/* Table footer */}
        {!usersLoading && !isError && users.length > 0 && (
          <div className="flex flex-col justify-between gap-2 border-t border-base-200 bg-base-200/20 px-4 py-3 sm:flex-row sm:items-center sm:px-5">
            <p className="text-[11px] text-base-content/40">
              Account management
              <span className="mx-2 text-base-content/20">•</span>
              {users.length} records
            </p>

            <p className="flex items-center gap-1.5 text-[11px] font-medium text-base-content/40">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Data synced with Wheelzy
            </p>
          </div>
        )}
      </section>

      {/* User details modal */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[3px]"
              onClick={() => setSelectedUser(null)}
            />

            <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 18 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                className="pointer-events-auto my-auto w-full max-w-md overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal header */}
                <div className="relative overflow-hidden border-b border-base-200 px-5 py-4 sm:px-6">
                  <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-primary/5" />

                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                        Account information
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-base-content">
                        User Details
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedUser(null)}
                      aria-label="Close user details"
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-base-200 text-base-content/50 transition-all hover:bg-base-300 hover:text-base-content"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                </div>

                {/* Profile */}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="rounded-[22px] border border-primary/15 bg-primary/5 p-1.5">
                      <Avatar user={selectedUser} size="large" />
                    </div>

                    <h4 className="mt-4 text-xl font-bold text-base-content">
                      {getDisplayName(selectedUser)}
                    </h4>

                    <p className="mt-1 max-w-full break-all text-sm text-base-content/45">
                      {selectedUser.email || "No email address"}
                    </p>

                    <div className="mt-3">
                      <RoleBadge role={selectedUser.role} />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-6 space-y-3">
                    <div className="rounded-2xl border border-base-300 bg-base-200/40 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <FaEnvelope size={13} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40">
                            Email address
                          </p>
                          <p className="mt-1 break-all text-sm font-semibold text-base-content">
                            {selectedUser.email || "Not available"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-base-300 bg-base-200/40 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <FaCalendarAlt size={13} />
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40">
                            Registration date
                          </p>
                          <p className="mt-1 text-sm font-semibold text-base-content">
                            {formatDate(selectedUser.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-base-300 bg-base-200/40 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <FaUserShield size={13} />
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40">
                            Account permission
                          </p>
                          <p className="mt-1 text-sm font-semibold capitalize text-base-content">
                            {selectedUser.role || "Unknown"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal footer */}
                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-white shadow-sm transition-all hover:brightness-95 active:scale-[0.99]"
                    style={{ backgroundColor: BRAND }}
                  >
                    Done
                    <FaChevronRight size={11} />
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageUsers;
