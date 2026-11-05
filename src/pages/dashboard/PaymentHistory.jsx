import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import {
  FaWallet,
  FaReceipt,
  FaCarSide,
  FaChartLine,
  FaCalendarDays,
  FaMagnifyingGlass,
  FaCreditCard,
  FaCopy,
  FaCircleCheck,
  FaRotateRight,
} from "react-icons/fa6";

import { FaBangladeshiTakaSign } from "react-icons/fa6";

import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";

const ITEMS_PER_PAGE = 10;

const formatCurrency = (amount) => {
  const value = Number(amount);

  if (!Number.isFinite(value)) return "N/A";

  return value.toLocaleString("en-BD");
};

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const StatCard = ({ title, value, subtitle, icon: Icon, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay: index * 0.07 }}
    className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-sm"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-medium text-base-content/50">{title}</p>

        <h3 className="text-2xl font-bold text-base-content mt-2 truncate">
          {value}
        </h3>

        <p className="text-xs text-base-content/40 mt-2">{subtitle}</p>
      </div>

      <div className="w-11 h-11 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="text-primary text-lg" />
      </div>
    </div>
  </motion.div>
);

const PaymentHistory = () => {
  const axiosSecure = useAxiosSecure();

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState("");

  const {
    data: payments = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["user-payments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments/history");
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // Summary statistics
  const stats = useMemo(() => {
    const totalAmount = payments.reduce((total, payment) => {
      const amount = Number(payment.amount);

      return total + (Number.isFinite(amount) ? amount : 0);
    }, 0);

    const uniqueCars = new Set(
      payments.map((payment) => payment.carName).filter(Boolean),
    ).size;

    return {
      totalAmount,
      totalTransactions: payments.length,
      uniqueCars,
      averagePayment: payments.length > 0 ? totalAmount / payments.length : 0,
    };
  }, [payments]);

  // Search
  const filteredPayments = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return payments.filter((payment) => {
      const transactionId = String(payment.transactionId || "").toLowerCase();

      const carName = String(payment.carName || "").toLowerCase();

      return transactionId.includes(search) || carName.includes(search);
    });
  }, [payments, searchText]);

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleCopy = async (transactionId) => {
    try {
      await navigator.clipboard.writeText(transactionId);

      setCopiedId(transactionId);

      setTimeout(() => {
        setCopiedId("");
      }, 1800);
    } catch (err) {
      console.error("Copy failed:", err);

      Swal.fire({
        icon: "error",
        title: "Copy failed",
        text: "Unable to copy transaction ID.",
      });
    }
  };

  if (isLoading) {
    return <Loader fullScreen={false} />;
  }

  if (isError) {
    return (
      <div className="bg-base-100 border border-base-300 rounded-2xl p-10 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-base-200 flex items-center justify-center">
          <FaWallet className="text-base-content/40 text-xl" />
        </div>

        <h3 className="font-bold text-base-content mt-4">
          Unable to load payments
        </h3>

        <p className="text-sm text-base-content/50 mt-1">
          {error?.message || "Failed to load payment history."}
        </p>

        <button
          onClick={() => refetch()}
          className="btn btn-primary btn-sm mt-5 rounded-xl"
        >
          <FaRotateRight />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-base-content">
              Payment History
            </h2>

            <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
              User
            </span>
          </div>

          <p className="text-sm text-base-content/50 mt-1">
            Track your car rental payments and transactions.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="btn btn-sm bg-base-100 border border-base-300 hover:bg-base-200 text-base-content rounded-xl shadow-none"
        >
          <FaRotateRight className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Spent"
          value={
            <span className="inline-flex items-center gap-1">
              <FaBangladeshiTakaSign className="text-base" />
              {formatCurrency(stats.totalAmount)}
            </span>
          }
          subtitle="Total rental payments"
          icon={FaWallet}
          index={0}
        />

        <StatCard
          title="Total Transactions"
          value={stats.totalTransactions.toLocaleString("en-BD")}
          subtitle="Recorded payment history"
          icon={FaReceipt}
          index={1}
        />

        <StatCard
          title="Cars Rented"
          value={stats.uniqueCars.toLocaleString("en-BD")}
          subtitle="Unique car names in history"
          icon={FaCarSide}
          index={2}
        />

        <StatCard
          title="Average Payment"
          value={
            <span className="inline-flex items-center gap-1">
              <FaBangladeshiTakaSign className="text-base" />
              {formatCurrency(stats.averagePayment)}
            </span>
          }
          subtitle="Average per transaction"
          icon={FaChartLine}
          index={3}
        />
      </div>

      {/* Spending Overview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-neutral text-neutral-content p-6 sm:p-8"
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-neutral-content/60 text-xs font-medium">
              <FaWallet />
              TOTAL RENTAL SPENDING
            </div>

            <h3 className="text-3xl sm:text-4xl font-bold mt-3 flex items-center gap-2">
              <FaBangladeshiTakaSign className="text-2xl text-primary" />
              {formatCurrency(stats.totalAmount)}
            </h3>

            <p className="text-sm text-neutral-content/50 mt-2">
              Your total recorded spending on Wheelzy.
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center">
            <FaCreditCard className="text-primary text-2xl" />
          </div>
        </div>

        <div className="absolute -right-10 -bottom-24 w-64 h-64 rounded-full border-[35px] border-primary/10 pointer-events-none" />

        <div className="absolute right-28 -top-20 w-40 h-40 rounded-full border-[25px] border-primary/5 pointer-events-none" />
      </motion.div>

      {/* Transaction History */}
      <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm overflow-hidden">
        {/* Section Header */}
        <div className="p-5 sm:p-6 border-b border-base-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-bold text-base-content text-lg">
                Transaction History
              </h3>

              <p className="text-xs text-base-content/45 mt-1">
                View your rental payment records.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/45 text-sm pointer-events-none z-10" />

              <input
                type="text"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by car or transaction..."
                className="input input-bordered w-full pl-10 h-11 min-h-0 rounded-xl bg-base-200 border-base-300 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredPayments.length === 0 ? (
          <div className="py-16 px-5 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-base-200 flex items-center justify-center">
              <FaWallet className="text-base-content/30 text-2xl" />
            </div>

            <h3 className="font-semibold text-base-content mt-4">
              {payments.length === 0
                ? "No payments yet"
                : "No matching transactions"}
            </h3>

            <p className="text-sm text-base-content/45 mt-1 max-w-sm mx-auto">
              {payments.length === 0
                ? "Your payment history will appear here after your first rental payment."
                : "Try searching with a different car name or transaction ID."}
            </p>

            {payments.length > 0 && (
              <button
                onClick={() => {
                  setSearchText("");
                  setCurrentPage(1);
                }}
                className="btn btn-sm btn-primary mt-4 rounded-xl"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="premium-table w-full">
                <thead>
                  <tr>
                    <th className="w-14">No.</th>
                    <th>Transaction ID</th>
                    <th>Car Details</th>
                    <th>Amount</th>
                    <th>Payment Date</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>

                <tbody className="text-center">
                  {paginatedPayments.map((payment, index) => (
                    <tr key={payment._id}>
                      <td className="text-base-content/40 text-xs font-medium">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>

                      {/* Transaction ID */}
                      <td>
                        <div className="flex items-center gap-2 max-w-48">
                          <span
                            title={payment.transactionId || "N/A"}
                            className="font-mono text-xs text-base-content/50 truncate"
                          >
                            {payment.transactionId || "N/A"}
                          </span>

                          {payment.transactionId && (
                            <button
                              type="button"
                              onClick={() => handleCopy(payment.transactionId)}
                              title="Copy transaction ID"
                              className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-base-content/40 hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                              {copiedId === payment.transactionId ? (
                                <FaCircleCheck className="text-primary text-xs" />
                              ) : (
                                <FaCopy className="text-xs" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Car */}
                      <td>
                        <span className="text-sm font-semibold text-base-content">
                          {payment.carName || "N/A"}
                        </span>
                      </td>

                      {/* Amount */}
                      <td>
                        <div className="inline-flex items-center gap-1 font-bold text-base-content">
                          <FaBangladeshiTakaSign className="text-primary text-xs" />

                          <span className="text-sm">
                            {formatCurrency(payment.amount)}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td>
                        <div className="flex items-center gap-2 text-xs text-base-content/50 whitespace-nowrap">
                          <FaCalendarDays className="text-primary" />
                          {formatDate(payment.paidAt)}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-base-200 text-base-content/70 text-xs font-semibold">
                          <FaCircleCheck className="text-primary" />
                          Paid
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 sm:px-6 py-4 border-t border-base-300">
              <p className="text-xs text-base-content/45">
                Showing{" "}
                <span className="font-semibold text-base-content">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                </span>
                {" - "}
                <span className="font-semibold text-base-content">
                  {Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredPayments.length,
                  )}
                </span>
                {" of "}
                <span className="font-semibold text-base-content">
                  {filteredPayments.length}
                </span>
                {" transactions"}
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="btn btn-sm bg-base-200 border-base-300 hover:bg-primary hover:text-primary-content disabled:opacity-40 rounded-lg"
                  >
                    Previous
                  </button>

                  <span className="text-xs font-semibold text-base-content/60 px-2">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="btn btn-sm bg-base-200 border-base-300 hover:bg-primary hover:text-primary-content disabled:opacity-40 rounded-lg"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
