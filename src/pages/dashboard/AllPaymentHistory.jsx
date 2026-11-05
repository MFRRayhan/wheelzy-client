import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";

import {
  FaSearch,
  FaMoneyBillWave,
  FaSyncAlt,
  FaCreditCard,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaReceipt,
  FaWallet,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";

import { FaArrowTrendUp, FaBangladeshiTakaSign } from "react-icons/fa6";

const BRAND = "#0F766E";

const statusConfig = {
  completed: {
    label: "Completed",
    icon: FaCheckCircle,
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  pending: {
    label: "Pending",
    icon: FaClock,
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  failed: {
    label: "Failed",
    icon: FaTimesCircle,
    className: "bg-red-500/10 text-red-500 border-red-500/20",
  },
};

const formatCurrency = (amount) => {
  const value = Number(amount);

  if (!Number.isFinite(value)) return "N/A";

  return (
    <span className="inline-flex items-center gap-1">
      <FaBangladeshiTakaSign className="text-sm" />
      {value.toLocaleString("en-BD")}
    </span>
  );
};

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

// Payment status badge
const StatusBadge = ({ status }) => {
  const currentStatus = statusConfig[status] || {
    label: status || "Completed",
    icon: FaReceipt,
    className: "bg-base-200 text-base-content/60 border-base-300",
  };

  const Icon = currentStatus.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold capitalize ${currentStatus.className}`}
    >
      <Icon size={10} />
      {currentStatus.label}
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
    success: "bg-emerald-500/10 text-emerald-600",
    warning: "bg-amber-500/10 text-amber-600",
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
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-base-content/45">
            {title}
          </p>

          <h3 className="mt-2 truncate text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
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

// Payment detail row
const PaymentDetail = ({ label, value, highlight = false }) => {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-base-300 py-3 last:border-0">
      <span className="text-xs font-medium text-base-content/45">{label}</span>

      <span
        className={`max-w-[65%] break-all text-right text-sm font-semibold ${
          highlight ? "text-primary" : "text-base-content"
        }`}
      >
        {value || "Not available"}
      </span>
    </div>
  );
};

// Payment details modal
const PaymentDetailsModal = ({ payment, onClose }) => {
  if (!payment) return null;

  const status = payment.status || "completed";

  return (
    <AnimatePresence>
      <motion.div
        key="payment-modal"
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
          className="w-full max-w-md overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-2xl"
        >
          {/* Modal header */}
          <div className="relative overflow-hidden border-b border-base-300 bg-base-200/50 p-5">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />

            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-base-100 text-base-content/50 transition hover:bg-red-500 hover:text-white z-50"
              aria-label="Close modal"
            >
              <FaTimes size={12} />
            </button>

            <div className="relative">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FaReceipt size={19} />
              </div>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Transaction Details
              </p>

              <h3 className="mt-1 text-xl font-bold text-base-content">
                Payment Information
              </h3>

              <div className="mt-3">
                <StatusBadge status={status} />
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="border-b border-base-300 px-5 py-6 text-center">
            <p className="text-xs font-medium text-base-content/45">
              Transaction Amount
            </p>

            {Number(payment.amount) === 0 ? (
              <h2 className="mt-2 text-3xl font-bold text-emerald-600">Free</h2>
            ) : (
              <div className="mt-2 flex items-center justify-center gap-1 text-base-content">
                <FaBangladeshiTakaSign className="text-primary" size={21} />

                <h2 className="text-3xl font-bold tracking-tight">
                  {Number(payment.amount).toLocaleString("en-BD")}
                </h2>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="px-5 py-3">
            <PaymentDetail
              label="Transaction ID"
              value={payment.transactionId}
              highlight
            />

            <PaymentDetail label="User Email" value={payment.userEmail} />

            <PaymentDetail
              label="Payment Type"
              value={payment.paymentType || "card"}
            />

            <PaymentDetail
              label="Payment Date"
              value={formatDate(payment.paidAt)}
            />

            <PaymentDetail label="Status" value={status} />
          </div>

          <div className="border-t border-base-300 p-5">
            <button
              type="button"
              onClick={onClose}
              className="h-11 w-full rounded-xl bg-primary text-sm font-bold text-primary-content transition hover:brightness-110"
            >
              Close Details
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const AllPaymentHistory = () => {
  const axiosSecure = useAxiosSecure();

  const [searchText, setSearchText] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch payments
  const {
    data: payments = [],
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["adminPayments"],

    queryFn: async () => {
      const res = await axiosSecure.get("/admin/payments");

      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // Payment statistics
  const stats = useMemo(() => {
    const completedPayments = payments.filter(
      (payment) => payment.status === "completed",
    );

    const pendingPayments = payments.filter(
      (payment) => payment.status === "pending",
    );

    const failedPayments = payments.filter(
      (payment) => payment.status === "failed",
    );

    const totalRevenue = completedPayments.reduce(
      (total, payment) => total + (Number(payment.amount) || 0),
      0,
    );

    return {
      total: payments.length,
      completed: completedPayments.length,
      pending: pendingPayments.length,
      failed: failedPayments.length,
      revenue: totalRevenue,
    };
  }, [payments]);

  // Search and status filtering
  const filteredPayments = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return payments.filter((payment) => {
      const userEmail = String(payment.userEmail || "").toLowerCase();
      const transactionId = String(payment.transactionId || "").toLowerCase();

      const matchesSearch =
        userEmail.includes(search) || transactionId.includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        (payment.status || "completed") === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, searchText, statusFilter]);

  if (isLoading) {
    return <Loader fullScreen={false} />;
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Page header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Administration
            </p>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
            Payment History
          </h1>

          <p className="mt-1.5 max-w-xl text-sm leading-6 text-base-content/50">
            Monitor transactions, track payment statuses, and review Wheelzy's
            payment records.
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
          title="Total Revenue"
          value={formatCurrency(stats.revenue)}
          description="From completed transactions"
          icon={FaWallet}
          variant="success"
        />

        <SummaryCard
          title="Total Transactions"
          value={stats.total}
          description="All recorded payments"
          icon={FaReceipt}
        />

        <SummaryCard
          title="Completed"
          value={stats.completed}
          description="Successfully processed"
          icon={FaCheckCircle}
          variant="success"
        />

        <SummaryCard
          title="Pending / Failed"
          value={`${stats.pending} / ${stats.failed}`}
          description="Awaiting or unsuccessful"
          icon={FaClock}
          variant="warning"
        />
      </div>

      {/* Main payment section */}
      <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col justify-between gap-4 border-b border-base-300 p-4 sm:p-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-base font-bold text-base-content">
              Transaction Records
            </h2>

            <p className="mt-1 text-xs text-base-content/45">
              Search and review all payment transactions.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <FaSearch
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/35"
                size={13}
              />

              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search email or transaction ID..."
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

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 w-full rounded-xl border border-base-300 bg-base-200/50 px-3 text-sm font-medium text-base-content outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 sm:w-40"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Error state */}
        {isError ? (
          <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <FaExclamationTriangle size={23} />
            </div>

            <h3 className="font-bold text-base-content">
              Unable to load payments
            </h3>

            <p className="mt-2 max-w-sm text-sm text-base-content/50">
              {error?.response?.data?.message ||
                "Something went wrong while fetching payment records."}
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
        ) : filteredPayments.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <FaMoneyBillWave size={30} />
            </div>

            <h3 className="text-lg font-bold text-base-content">
              {searchText || statusFilter !== "all"
                ? "No matching transactions"
                : "No payment records yet"}
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-base-content/45">
              {searchText || statusFilter !== "all"
                ? "No transactions match your current search or status filter."
                : "Payment transactions will appear here once users make payments."}
            </p>

            {(searchText || statusFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchText("");
                  setStatusFilter("all");
                }}
                className="mt-4 text-sm font-bold text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="premium-table w-full min-w-[900px]">
                <thead>
                  <tr>
                    <th className="w-14">No.</th>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Transaction ID</th>
                    <th>Payment Type</th>
                    <th>Paid Date</th>
                    <th>Status</th>
                    <th className="text-right">Details</th>
                  </tr>
                </thead>

                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filteredPayments.map((payment, index) => (
                      <motion.tr
                        key={payment._id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td className="font-medium text-base-content/35">
                          {String(index + 1).padStart(2, "0")}
                        </td>

                        {/* User */}
                        <td>
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                              <FaCreditCard size={13} />
                            </div>

                            <span className="max-w-[190px] truncate text-xs font-semibold text-base-content/70">
                              {payment.userEmail || "Not available"}
                            </span>
                          </div>
                        </td>

                        {/* Amount */}
                        <td>
                          {Number(payment.amount) === 0 ? (
                            <span className="inline-flex items-center rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600">
                              Free
                            </span>
                          ) : (
                            <div className="flex items-center gap-1 font-bold text-base-content">
                              <FaBangladeshiTakaSign
                                className="text-primary"
                                size={12}
                              />

                              <span className="text-sm">
                                {Number(payment.amount).toLocaleString("en-BD")}
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Transaction ID */}
                        <td>
                          <span
                            title={payment.transactionId}
                            className="block max-w-[145px] truncate rounded-lg bg-base-200 px-2.5 py-1.5 font-mono text-[10px] font-medium text-base-content/60"
                          >
                            {payment.transactionId || "N/A"}
                          </span>
                        </td>

                        {/* Payment type */}
                        <td>
                          <div className="flex items-center gap-2 text-xs font-medium capitalize text-base-content/60">
                            <FaCreditCard
                              className="text-base-content/35"
                              size={12}
                            />

                            {payment.paymentType || "card"}
                          </div>
                        </td>

                        {/* Date */}
                        <td>
                          <span className="text-xs text-base-content/50">
                            {formatDate(payment.paidAt)}
                          </span>
                        </td>

                        {/* Status */}
                        <td>
                          <StatusBadge status={payment.status || "completed"} />
                        </td>

                        {/* Details */}
                        <td>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => setSelectedPayment(payment)}
                              title="View payment details"
                              aria-label="View payment details"
                              className="flex h-9 w-9 items-center justify-center rounded-xl bg-base-200 text-base-content/60 transition hover:bg-primary hover:text-white"
                            >
                              <FaReceipt size={13} />
                            </button>
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
                  {filteredPayments.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-base-content">
                  {payments.length}
                </span>{" "}
                transactions
              </p>

              <div className="flex items-center gap-2 text-xs text-base-content/45">
                <FaArrowTrendUp className="text-primary" size={12} />
                Revenue counts completed payments only
              </div>
            </div>
          </>
        )}
      </div>

      {/* Payment details modal */}
      {selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  );
};

export default AllPaymentHistory;
