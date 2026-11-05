import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

import {
  FaEye,
  FaCheck,
  FaTimes,
  FaSearch,
  FaUserClock,
  FaUsers,
  FaSyncAlt,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaIdCard,
  FaUser,
  FaClock,
} from "react-icons/fa";

import Loader from "../../components/Loader";

const BRAND = "#0F766E";

const formatDate = (date) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name = "") => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

// Status badge
const StatusBadge = ({ status }) => {
  const config = {
    pending: {
      label: "Pending",
      icon: FaClock,
      className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    },
    approved: {
      label: "Approved",
      icon: FaCheckCircle,
      className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    rejected: {
      label: "Rejected",
      icon: FaTimesCircle,
      className: "bg-red-500/10 text-red-500 border-red-500/20",
    },
  };

  const current = config[status] || {
    label: status || "Unknown",
    icon: FaClock,
    className: "bg-base-200 text-base-content/60 border-base-300",
  };

  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold capitalize ${current.className}`}
    >
      <Icon size={10} />
      {current.label}
    </span>
  );
};

// Summary card
const SummaryCard = ({
  title,
  value,
  description,
  icon: Icon,
  variant = "default",
}) => {
  const iconStyles = {
    default: "bg-primary/10 text-primary",
    warning: "bg-amber-500/10 text-amber-600",
    success: "bg-emerald-500/10 text-emerald-600",
    danger: "bg-red-500/10 text-red-500",
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm"
    >
      <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-base-content/45">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold tracking-tight text-base-content">
            {value}
          </h3>

          <p className="mt-1 text-xs text-base-content/45">{description}</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconStyles[variant]}`}
        >
          <Icon size={19} />
        </div>
      </div>
    </motion.div>
  );
};

// Action button
const ActionButton = ({
  icon: Icon,
  label,
  onClick,
  variant = "default",
  disabled = false,
}) => {
  const styles = {
    default:
      "bg-base-200 text-base-content/60 hover:bg-primary hover:text-white",
    success:
      "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white",
  };

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${styles[variant]}`}
    >
      <Icon size={13} />
    </button>
  );
};

// Applicant avatar
const ApplicantAvatar = ({ name, size = "normal" }) => {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary ${
        size === "large" ? "h-16 w-16 text-xl" : "h-11 w-11 text-sm"
      }`}
    >
      {getInitials(name) || <FaUser size={15} />}
    </div>
  );
};

// Detail item
const DetailItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-base-300 bg-base-200/50 p-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon size={13} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-base-content">
          {value || "Not available"}
        </p>
      </div>
    </div>
  );
};

// Application details modal
const ApplicationDetailsModal = ({
  application,
  onClose,
  onApprove,
  onReject,
  isProcessing,
}) => {
  if (!application) return null;

  const location = [application.district, application.division]
    .filter(Boolean)
    .join(", ");

  return (
    <AnimatePresence>
      <motion.div
        key="rider-application-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-base-300 bg-base-100 shadow-2xl"
        >
          {/* Modal header */}
          <div className="relative overflow-hidden border-b border-base-300 bg-base-200/60 p-6">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl bg-base-100 text-base-content/50 transition hover:bg-base-300 hover:text-base-content disabled:opacity-40"
              aria-label="Close modal"
            >
              <FaTimes size={13} />
            </button>

            <div className="relative flex items-center gap-4">
              <ApplicantAvatar name={application.name} size="large" />

              <div className="min-w-0 pr-8">
                <div className="mb-1">
                  <StatusBadge status={application.status} />
                </div>

                <h3 className="truncate text-xl font-bold text-base-content">
                  {application.name || "Unnamed applicant"}
                </h3>

                <p className="mt-1 break-all text-xs text-base-content/50">
                  {application.email || "No email provided"}
                </p>
              </div>
            </div>

            <p className="relative mt-5 text-xs leading-6 text-base-content/50">
              Review the applicant information before making a decision on this
              rider application.
            </p>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            {/* Personal information */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <FaIdCard className="text-primary" size={14} />

                <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/60">
                  Applicant Information
                </h4>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailItem
                  icon={FaUser}
                  label="Full Name"
                  value={application.name}
                />

                <DetailItem
                  icon={FaEnvelope}
                  label="Email Address"
                  value={application.email}
                />

                <DetailItem
                  icon={FaPhone}
                  label="Contact Number"
                  value={application.contact}
                />

                <DetailItem
                  icon={FaMapMarkerAlt}
                  label="Location"
                  value={location}
                />

                <DetailItem
                  icon={FaCalendarAlt}
                  label="Applied Date"
                  value={formatDate(
                    application.appliedAt || application.createdAt,
                  )}
                />

                <DetailItem
                  icon={FaUserClock}
                  label="Application Status"
                  value={application.status}
                />
              </div>
            </div>

            {/* Description */}
            {application.description && (
              <div className="rounded-2xl border border-base-300 bg-base-200/50 p-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-base-content/40">
                  Applicant Description
                </p>

                <p className="text-sm leading-7 text-base-content/70">
                  {application.description}
                </p>
              </div>
            )}

            {/* Actions */}
            {application.status === "pending" && (
              <div className="grid grid-cols-2 gap-3 border-t border-base-300 pt-5">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={onReject}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 text-sm font-bold text-red-500 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
                >
                  <FaTimes size={13} />
                  Reject
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={onApprove}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-content shadow-lg shadow-primary/20 transition hover:brightness-110 disabled:opacity-50"
                >
                  <FaCheck size={13} />
                  Approve Rider
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const PendingRiderRequests = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [searchText, setSearchText] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch rider applications
  const {
    data: applications = [],
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["rider-applications"],

    queryFn: async () => {
      const res = await axiosSecure.get("/admin/rider-applications");

      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // Update rider application status
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return axiosSecure.patch(`/admin/rider-applications/${id}`, {
        status,
      });
    },

    onSuccess: async (_, variables) => {
      const { status } = variables;

      await queryClient.invalidateQueries({
        queryKey: ["rider-applications"],
      });

      setSelectedItem(null);

      Swal.fire({
        icon: "success",
        title:
          status === "approved" ? "Rider Approved!" : "Application Rejected!",
        text:
          status === "approved"
            ? "The rider application has been approved successfully."
            : "The rider application has been rejected.",
        timer: 1700,
        showConfirmButton: false,
      });
    },

    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          err.response?.data?.message ||
          "Unable to update the rider application. Please try again.",
        confirmButtonColor: BRAND,
      });
    },
  });

  // Application statistics
  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((app) => app.status === "pending").length,
      approved: applications.filter((app) => app.status === "approved").length,
      rejected: applications.filter((app) => app.status === "rejected").length,
    };
  }, [applications]);

  // Search only pending applications
  const pendingApplications = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return applications.filter((app) => {
      if (app.status !== "pending") return false;

      if (!search) return true;

      const searchableFields = [
        app.name,
        app.email,
        app.contact,
        app.district,
        app.division,
      ];

      return searchableFields.some((field) =>
        String(field || "")
          .toLowerCase()
          .includes(search),
      );
    });
  }, [applications, searchText]);

  // Update application status
  const handleUpdateStatus = async (application, status) => {
    if (!application?._id || statusMutation.isPending) return;

    const isApproving = status === "approved";

    const result = await Swal.fire({
      icon: isApproving ? "question" : "warning",
      title: isApproving ? "Approve this rider?" : "Reject this application?",
      text: isApproving
        ? `Approve the rider application from ${application.name || "this applicant"}?`
        : `Are you sure you want to reject the application from ${application.name || "this applicant"}?`,
      showCancelButton: true,
      confirmButtonText: isApproving ? "Yes, approve" : "Yes, reject",
      cancelButtonText: "Cancel",
      confirmButtonColor: isApproving ? BRAND : "#DC2626",
      cancelButtonColor: "#64748B",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    statusMutation.mutate({
      id: application._id,
      status,
    });
  };

  if (isLoading) {
    return <Loader fullScreen={false} />;
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Page header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Administration
            </p>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
            Rider Applications
          </h1>

          <p className="mt-1.5 max-w-xl text-sm leading-6 text-base-content/50">
            Review rider applications, verify applicant information, and manage
            rider approval requests.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-base-300 bg-base-100 px-4 text-sm font-semibold text-base-content/70 shadow-sm transition hover:border-primary/30 hover:text-primary disabled:opacity-50"
        >
          <FaSyncAlt className={isFetching ? "animate-spin" : ""} size={13} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Applications"
          value={stats.total}
          description="All rider applications"
          icon={FaUsers}
        />

        <SummaryCard
          title="Pending Review"
          value={stats.pending}
          description="Waiting for admin decision"
          icon={FaUserClock}
          variant="warning"
        />

        <SummaryCard
          title="Approved Riders"
          value={stats.approved}
          description="Successfully approved"
          icon={FaCheckCircle}
          variant="success"
        />

        <SummaryCard
          title="Rejected Requests"
          value={stats.rejected}
          description="Applications rejected"
          icon={FaTimesCircle}
          variant="danger"
        />
      </div>

      {/* Main content */}
      <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col justify-between gap-4 border-b border-base-300 p-4 sm:p-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-base font-bold text-base-content">
              Pending Applications
            </h2>

            <p className="mt-1 text-xs text-base-content/45">
              Review and manage rider registration requests.
            </p>
          </div>

          <div className="relative w-full lg:max-w-xs">
            <FaSearch
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/35"
              size={13}
            />

            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search name, email, contact..."
              className="h-11 w-full rounded-xl border border-base-300 bg-base-200/50 pl-10 pr-10 text-sm text-base-content outline-none transition placeholder:text-base-content/35 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />

            {searchText && (
              <button
                type="button"
                onClick={() => setSearchText("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 transition hover:text-error"
                aria-label="Clear search"
              >
                <FaTimes size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Error state */}
        {isError ? (
          <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <FaExclamationTriangle size={23} />
            </div>

            <h3 className="font-bold text-base-content">
              Unable to load applications
            </h3>

            <p className="mt-2 max-w-sm text-sm text-base-content/50">
              {error?.response?.data?.message ||
                "Something went wrong while fetching rider applications."}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-content transition hover:brightness-110"
            >
              <FaSyncAlt size={12} />
              Try Again
            </button>
          </div>
        ) : pendingApplications.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              {searchText ? (
                <FaSearch size={27} />
              ) : (
                <FaCheckCircle size={30} />
              )}
            </div>

            <h3 className="text-lg font-bold text-base-content">
              {searchText ? "No matching applications" : "All caught up!"}
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-base-content/45">
              {searchText
                ? "No pending rider applications match your search. Try another keyword."
                : "There are currently no rider applications waiting for review."}
            </p>

            {searchText && (
              <button
                type="button"
                onClick={() => setSearchText("")}
                className="mt-4 text-sm font-bold text-primary hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Applications table */}
            <div className="overflow-x-auto">
              <table className="premium-table w-full min-w-[950px]">
                <thead>
                  <tr>
                    <th className="w-14">No.</th>
                    <th>Applicant</th>
                    <th>Contact</th>
                    <th>Location</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  <AnimatePresence mode="popLayout">
                    {pendingApplications.map((app, index) => (
                      <motion.tr
                        key={app._id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td className="font-medium text-base-content/35">
                          {String(index + 1).padStart(2, "0")}
                        </td>

                        {/* Applicant */}
                        <td>
                          <div className="flex items-center gap-3">
                            <ApplicantAvatar name={app.name} />

                            <div className="min-w-0">
                              <p className="max-w-[180px] truncate text-sm font-bold text-base-content">
                                {app.name || "Unnamed applicant"}
                              </p>

                              <p className="mt-1 max-w-[180px] truncate text-xs text-base-content/45">
                                {app.email || "No email provided"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td>
                          <div className="flex items-center gap-2 text-xs text-base-content/65">
                            <FaPhone
                              className="shrink-0 text-primary/60"
                              size={11}
                            />

                            {app.contact || "Not available"}
                          </div>
                        </td>

                        {/* Location */}
                        <td>
                          <div className="flex items-center gap-2 text-xs text-base-content/60">
                            <FaMapMarkerAlt
                              className="shrink-0 text-primary/60"
                              size={11}
                            />

                            <span className="max-w-[130px] truncate">
                              {[app.district, app.division]
                                .filter(Boolean)
                                .join(", ") || "Not available"}
                            </span>
                          </div>
                        </td>

                        {/* Applied date */}
                        <td>
                          <div className="flex items-center gap-1.5 text-xs text-base-content/50">
                            <FaCalendarAlt size={11} />
                            {formatDate(app.appliedAt || app.createdAt)}
                          </div>
                        </td>

                        {/* Status */}
                        <td>
                          <StatusBadge status={app.status} />
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="flex items-center justify-end gap-2">
                            <ActionButton
                              icon={FaEye}
                              label="View details"
                              onClick={() => setSelectedItem(app)}
                              disabled={statusMutation.isPending}
                            />

                            <ActionButton
                              icon={FaCheck}
                              label="Approve application"
                              variant="success"
                              onClick={() =>
                                handleUpdateStatus(app, "approved")
                              }
                              disabled={statusMutation.isPending}
                            />

                            <ActionButton
                              icon={FaTimes}
                              label="Reject application"
                              variant="danger"
                              onClick={() =>
                                handleUpdateStatus(app, "rejected")
                              }
                              disabled={statusMutation.isPending}
                            />
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="flex flex-col justify-between gap-2 border-t border-base-300 px-5 py-4 sm:flex-row sm:items-center">
              <p className="text-xs text-base-content/45">
                Showing{" "}
                <span className="font-bold text-base-content">
                  {pendingApplications.length}
                </span>{" "}
                pending applications
              </p>

              <div className="flex items-center gap-2 text-xs text-amber-600">
                <FaClock size={11} />
                Requires admin review
              </div>
            </div>
          </>
        )}
      </div>

      {/* Application details modal */}
      {selectedItem && (
        <ApplicationDetailsModal
          application={selectedItem}
          onClose={() => {
            if (!statusMutation.isPending) {
              setSelectedItem(null);
            }
          }}
          onApprove={() => handleUpdateStatus(selectedItem, "approved")}
          onReject={() => handleUpdateStatus(selectedItem, "rejected")}
          isProcessing={statusMutation.isPending}
        />
      )}
    </div>
  );
};

export default PendingRiderRequests;
