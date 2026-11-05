import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import {
  FaEye,
  FaTrash,
  FaSearch,
  FaCar,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaBan,
  FaArrowRight,
} from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";
import SummaryCard from "../../components/SummaryCard";

const statusConfig = {
  active: {
    label: "Active",
    icon: FaCheckCircle,
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  },
  cancelled: {
    label: "Cancelled",
    icon: FaBan,
    className: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
  },
  pending: {
    label: "Pending",
    icon: FaClock,
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  },
};

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount) => {
  const value = Number(amount);

  if (!Number.isFinite(value)) return "N/A";

  return value.toLocaleString("en-BD");
};

const ActionButton = ({ icon: Icon, title, onClick, variant = "default" }) => {
  const variants = {
    default:
      "bg-base-200 text-base-content/60 hover:bg-primary hover:text-primary-content",
    danger:
      "bg-base-200 text-base-content/60 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/30",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${variants[variant]}`}
    >
      <Icon size={13} />
    </button>
  );
};

const MyCars = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [searchText, setSearchText] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const {
    data: bookings = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["userBookings", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/memberships/active");
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: !!user?.email,
  });

  const filteredBookings = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    if (!search) return bookings;

    return bookings.filter((booking) =>
      String(booking.carName || "")
        .toLowerCase()
        .includes(search),
    );
  }, [bookings, searchText]);

  const summary = useMemo(() => {
    const total = bookings.length;
    const active = bookings.filter(
      (booking) => booking.status === "active",
    ).length;
    const pending = bookings.filter(
      (booking) => booking.status === "pending",
    ).length;
    const totalSpent = bookings.reduce(
      (sum, booking) => sum + (Number(booking.membershipFee) || 0),
      0,
    );

    return { total, active, pending, totalSpent };
  }, [bookings]);

  const handleCancelBooking = async (bookingId, carName) => {
    const result = await Swal.fire({
      title: "Cancel Booking?",
      text: `Are you sure you want to cancel your booking for "${carName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Cancel Booking",
      cancelButtonText: "Keep Booking",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setCancellingId(bookingId);

      const res = await axiosSecure.patch(`/memberships/cancel/${bookingId}`);

      if (res.data.modifiedCount > 0) {
        await queryClient.invalidateQueries({
          queryKey: ["userBookings", user?.email],
        });

        Swal.fire({
          icon: "success",
          title: "Booking Cancelled",
          text: "Your booking has been cancelled successfully.",
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Cancellation Failed",
          text: res.data.message || "Could not cancel your booking.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something Went Wrong",
        text:
          error.response?.data?.message ||
          "Server error occurred. Please try again.",
      });
    } finally {
      setCancellingId(null);
    }
  };

  if (isLoading) return <Loader fullScreen={false} />;

  if (isError) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-base-300 bg-base-100 px-5 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400">
          <FaCar size={23} />
        </div>

        <h3 className="text-lg font-bold text-base-content">
          Unable to Load Bookings
        </h3>

        <p className="mt-2 max-w-sm text-sm text-base-content/50">
          Something went wrong while fetching your bookings.
        </p>

        <button
          onClick={() => refetch()}
          className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-content transition hover:opacity-90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            Personal Dashboard
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-base-content">
            My Bookings
          </h2>

          <p className="mt-1 text-sm text-base-content/50">
            Manage and track all your car bookings in one place.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex h-10 items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-4 text-sm font-semibold text-base-content/70 transition hover:border-primary hover:text-primary disabled:opacity-50"
          >
            <span className={isFetching ? "animate-spin" : ""}>↻</span>
            Refresh
          </button>

          <Link
            to="/cars"
            className="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-content transition hover:opacity-90"
          >
            Browse Cars
            <FaArrowRight size={11} />
          </Link>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <SummaryCard
          title="Total Bookings"
          value={summary.total}
          icon={FaCar}
          color="bg-primary"
        />

        <SummaryCard
          title="Active Bookings"
          value={summary.active}
          icon={FaCheckCircle}
          color="bg-primary"
        />

        <SummaryCard
          title="Pending Bookings"
          value={summary.pending}
          icon={FaClock}
          color="bg-primary"
        />

        <SummaryCard
          title="Total Membership Fees"
          value={
            <span className="inline-flex items-center gap-1">
              <FaBangladeshiTakaSign className="text-lg text-primary" />
              {formatCurrency(summary.totalSpent)}
            </span>
          }
          icon={FaCalendarAlt}
          color="bg-primary"
        />
      </motion.div>

      {/* Booking Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm"
      >
        {/* Table Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-base-300 p-5 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-bold text-base-content">Booking History</h3>

            <p className="mt-1 text-xs text-base-content/45">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <FaSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-base-content/30" />

            <input
              type="text"
              placeholder="Search by car name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="h-10 w-full rounded-xl border border-base-300 bg-base-200/50 pl-10 pr-4 text-sm text-base-content outline-none transition placeholder:text-base-content/35 focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
        </div>

        {bookings.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <FaCar size={32} />
            </div>

            <h3 className="text-lg font-bold text-base-content">
              No Active Bookings
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-base-content/50">
              You haven't booked any cars yet. Explore our available cars and
              make your first booking.
            </p>

            <Link
              to="/cars"
              className="mt-6 flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-content transition hover:opacity-90"
            >
              Explore Cars
              <FaArrowRight size={11} />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="premium-table w-full">
              <thead>
                <tr>
                  <th className="w-14">No.</th>
                  <th>Car Name</th>
                  <th>Membership Fee</th>
                  <th>Booked On</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking, index) => {
                    const status = statusConfig[booking.status] || {
                      label: booking.status || "Unknown",
                      icon: FaClock,
                      className: "bg-base-200 text-base-content/60",
                    };

                    const StatusIcon = status.icon;
                    const isCancelling = cancellingId === booking._id;

                    return (
                      <motion.tr
                        key={booking._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25 }}
                      >
                        <td className="font-medium text-base-content/40">
                          {index + 1}
                        </td>

                        <td>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                              <FaCar size={16} />
                            </div>

                            <div>
                              <p className="font-semibold text-base-content">
                                {booking.carName || "Unknown Car"}
                              </p>

                              <p className="mt-0.5 text-[11px] text-base-content/40">
                                Booking ID: {booking._id.slice(-8)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td>
                          {Number(booking.membershipFee) === 0 ? (
                            <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                              Free
                            </span>
                          ) : (
                            <div className="inline-flex items-center gap-1 font-bold text-base-content">
                              <FaBangladeshiTakaSign className="text-xs text-primary" />
                              <span className="text-sm">
                                {formatCurrency(booking.membershipFee)}
                              </span>
                            </div>
                          )}
                        </td>

                        <td className="text-xs font-medium text-base-content/55">
                          {formatDate(booking.purchaseDate)}
                        </td>

                        <td>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold ${status.className}`}
                          >
                            <StatusIcon size={10} />
                            {status.label}
                          </span>
                        </td>

                        <td>
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              to={`/cars/${booking.carId}`}
                              title="View car"
                              aria-label="View car"
                              className="flex h-9 w-9 items-center justify-center rounded-xl bg-base-200 text-base-content/60 transition hover:bg-primary hover:text-primary-content"
                            >
                              <FaEye size={13} />
                            </Link>

                            <ActionButton
                              icon={FaTrash}
                              title="Cancel booking"
                              variant="danger"
                              onClick={() =>
                                handleCancelBooking(
                                  booking._id,
                                  booking.carName,
                                )
                              }
                            />
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <FaSearch className="mb-3 text-2xl text-base-content/20" />

                        <p className="font-semibold text-base-content">
                          No Matching Bookings
                        </p>

                        <p className="mt-1 text-xs text-base-content/45">
                          Try searching with a different car name.
                        </p>

                        <button
                          onClick={() => setSearchText("")}
                          className="mt-4 text-xs font-bold text-primary hover:underline"
                        >
                          Clear Search
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        {bookings.length > 0 && (
          <div className="flex flex-col justify-between gap-2 border-t border-base-300 px-5 py-4 sm:flex-row sm:items-center">
            <p className="text-xs text-base-content/45">
              Showing {filteredBookings.length} booking
              {filteredBookings.length !== 1 ? "s" : ""}
            </p>

            <Link
              to="/cars"
              className="text-xs font-bold text-primary transition hover:underline"
            >
              Find More Cars →
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MyCars;
