import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";

import {
  FaWallet,
  FaArrowTrendUp,
  FaReceipt,
  FaCreditCard,
  FaCopy,
  FaUser,
  FaArrowUpRightFromSquare,
  FaRotateRight,
  FaChartLine,
  FaFilter,
} from "react-icons/fa6";

import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { FaCalendarAlt, FaCheckCircle, FaSearch } from "react-icons/fa";
import SummaryCard from "../../components/SummaryCard";

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

const RiderPayments = () => {
  const axiosSecure = useAxiosSecure();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState("");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await axiosSecure.get("/rider/payments");

      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load rider payments:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [axiosSecure]);

  // Summary statistics
  const stats = useMemo(() => {
    const totalAmount = payments.reduce((total, payment) => {
      const amount = Number(payment.amount);
      return total + (Number.isFinite(amount) ? amount : 0);
    }, 0);

    const paidTransactions = payments.filter(
      (payment) => Number(payment.amount) > 0,
    ).length;

    return {
      totalAmount,
      totalTransactions: payments.length,
      paidTransactions,
      averagePayment: payments.length > 0 ? totalAmount / payments.length : 0,
    };
  }, [payments]);

  // Payment type options
  const paymentTypes = useMemo(() => {
    return [
      ...new Set(
        payments.map((payment) => payment.paymentType).filter(Boolean),
      ),
    ];
  }, [payments]);

  // Search and filter
  const filteredPayments = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        !search ||
        payment.userEmail?.toLowerCase().includes(search) ||
        payment.transactionId?.toLowerCase().includes(search);

      const matchesType =
        paymentFilter === "all" ||
        payment.paymentType?.toLowerCase() === paymentFilter.toLowerCase();

      return matchesSearch && matchesType;
    });
  }, [payments, searchText, paymentFilter]);

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

  const resetFilters = () => {
    setSearchText("");
    setPaymentFilter("all");
    setCurrentPage(1);
  };

  if (loading) {
    return <Loader fullScreen={false} />;
  }

  if (error) {
    return (
      <div className="bg-base-100 border border-base-300 rounded-2xl p-10 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-base-200 flex items-center justify-center">
          <FaWallet className="text-base-content/40 text-xl" />
        </div>

        <h3 className="font-bold text-base-content mt-4">
          Unable to load earnings
        </h3>

        <p className="text-sm text-base-content/50 mt-1">
          Something went wrong while fetching your payment history.
        </p>

        <button
          onClick={fetchPayments}
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
              Earnings History
            </h2>

            <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
              Rider
            </span>
          </div>

          <p className="text-sm text-base-content/50 mt-1">
            Track your rental income and payment transactions.
          </p>
        </div>

        <button
          onClick={fetchPayments}
          className="btn btn-sm bg-base-100 border border-base-300 hover:bg-base-200 text-base-content rounded-xl shadow-none"
        >
          <FaRotateRight />
          Refresh
        </button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Earnings"
          count={
            <span className="inline-flex items-center gap-1">
              <FaBangladeshiTakaSign className="text-base" />
              {formatCurrency(stats.totalAmount)}
            </span>
          }
          subtitle="All recorded payments"
          icon={FaWallet}
          index={0}
        />

        <SummaryCard
          title="Total Transactions"
          count={stats.totalTransactions.toLocaleString("en-BD")}
          subtitle="Total payment records"
          icon={FaReceipt}
          index={1}
        />

        <SummaryCard
          title="Paid Transactions"
          count={stats.paidTransactions.toLocaleString("en-BD")}
          subtitle="Transactions above zero"
          icon={FaCheckCircle}
          index={2}
        />

        <SummaryCard
          title="Average Payment"
          count={
            <span className="inline-flex items-center gap-1">
              <FaBangladeshiTakaSign className="text-base" />
              {formatCurrency(stats.averagePayment)}
            </span>
          }
          subtitle="Per recorded transaction"
          icon={FaChartLine}
          index={3}
        />
      </div>

      {/* Earnings Overview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-neutral text-neutral-content p-6 sm:p-8"
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-neutral-content/60 text-xs font-medium">
              <FaWallet />
              LIFETIME EARNINGS
            </div>

            <h3 className="text-3xl sm:text-4xl font-bold mt-3 flex items-center gap-2">
              <FaBangladeshiTakaSign className="text-2xl text-primary" />
              {formatCurrency(stats.totalAmount)}
            </h3>

            <p className="text-sm text-neutral-content/50 mt-2">
              Your total recorded earnings from Wheelzy rentals.
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center">
            <FaArrowTrendUp className="text-primary text-2xl" />
          </div>
        </div>

        <div className="absolute -right-10 -bottom-24 w-64 h-64 rounded-full border-[35px] border-primary/10 pointer-events-none" />
        <div className="absolute right-28 -top-20 w-40 h-40 rounded-full border-[25px] border-primary/5 pointer-events-none" />
      </motion.div>

      {/* Transaction Section */}
      <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm overflow-hidden">
        {/* Section Header */}
        <div className="p-5 sm:p-6 border-b border-base-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="font-bold text-base-content text-lg">
                Transaction History
              </h3>

              <p className="text-xs text-base-content/45 mt-1">
                View and manage your payment records.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/35 text-sm" />

                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search transaction..."
                  className="input input-bordered w-full pl-10 h-11 min-h-0 rounded-xl bg-base-200 border-base-300 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>

              {/* Payment Type Filter */}
              <div className="relative">
                <FaFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/35 text-xs pointer-events-none" />

                <select
                  value={paymentFilter}
                  onChange={(e) => {
                    setPaymentFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="select select-bordered w-full sm:w-40 pl-9 h-11 min-h-0 rounded-xl bg-base-200 border-base-300 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="all">All Types</option>

                  {paymentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredPayments.length === 0 ? (
          <div className="py-16 px-5 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-base-200 flex items-center justify-center">
              <FaWallet className="text-base-content/30 text-2xl" />
            </div>

            <h3 className="font-semibold text-base-content mt-4">
              {payments.length === 0
                ? "No earnings yet"
                : "No matching transactions"}
            </h3>

            <p className="text-sm text-base-content/45 mt-1 max-w-sm mx-auto">
              {payments.length === 0
                ? "Payments from your car rentals will appear here."
                : "Try adjusting your search or payment type filter."}
            </p>

            {payments.length > 0 && (
              <button
                onClick={resetFilters}
                className="btn btn-sm btn-primary mt-4 rounded-xl"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="premium-table w-full">
                <thead>
                  <tr>
                    <th className="w-14">No.</th>
                    <th>Payment Type</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Transaction ID</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedPayments.map((payment, index) => (
                    <tr key={payment._id}>
                      <td className="text-base-content/40 text-xs font-medium">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>

                      <td>
                        <span className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-base-200 text-base-content/70 text-xs font-semibold capitalize">
                          <FaCreditCard className="text-primary" />
                          {payment.paymentType || "N/A"}
                        </span>
                      </td>

                      <td>
                        <div className="flex items-center gap-2 min-w-40">
                          <div className="w-8 h-8 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FaUser className="text-primary text-xs" />
                          </div>

                          <span className="text-xs text-base-content/70 max-w-48 truncate">
                            {payment.userEmail || "N/A"}
                          </span>
                        </div>
                      </td>

                      <td>
                        {Number(payment.amount) === 0 ? (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-base-200 text-base-content/60">
                            Free
                          </span>
                        ) : (
                          <div className="inline-flex items-center gap-1 font-bold text-base-content">
                            <FaBangladeshiTakaSign className="text-primary text-xs" />
                            <span className="text-sm">
                              {formatCurrency(payment.amount)}
                            </span>
                          </div>
                        )}
                      </td>

                      <td>
                        <div className="flex items-center gap-2 max-w-48">
                          <span
                            title={payment.transactionId || "N/A"}
                            className="font-mono text-xs text-base-content/45 truncate"
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
                                <FaCheckCircle className="text-primary text-xs" />
                              ) : (
                                <FaCopy className="text-xs" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="flex items-center gap-2 text-xs text-base-content/50 whitespace-nowrap">
                          <FaCalendarAlt className="text-primary" />
                          {formatDate(payment.paidAt)}
                        </div>
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

export default RiderPayments;
