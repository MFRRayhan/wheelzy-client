import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";
import { FaSearch, FaMoneyBillWave } from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const statusBadge = {
  completed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
};

const AllPaymentHistory = () => {
  const axiosSecure = useAxiosSecure();
  const [searchText, setSearchText] = useState("");

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["adminPayments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/payments");
      return res.data;
    },
  });

  if (isLoading) return <Loader fullScreen={false} />;

  const filteredPayments = payments.filter(
    (p) =>
      p.userEmail.toLowerCase().includes(searchText.toLowerCase()) ||
      p.transactionId.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-base-content">All Payments</h2>
          <p className="text-sm text-base-content/50 mt-0.5">
            {filteredPayments.length} transactions
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/30 text-sm pointer-events-none" />
          <input
            type="text"
            placeholder="Search by email or transaction..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-base-100 border border-base-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="premium-table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>User Email</th>
                <th>Amount</th>
                <th>Transaction ID</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment, index) => (
                  <tr key={payment._id}>
                    <td className="text-base-content/40">{index + 1}</td>
                    <td className="text-base-content/70">
                      {payment.userEmail}
                    </td>
                    <td>
                      {payment.amount === 0 ? (
                        <span className="text-emerald-600 font-semibold text-xs">
                          Free
                        </span>
                      ) : (
                        <div className="flex items-center gap-0.5 font-semibold text-base-content">
                          <FaBangladeshiTakaSign className="text-xs text-primary" />
                          <span className="text-sm">{payment.amount}</span>
                        </div>
                      )}
                    </td>
                    <td className="font-mono text-xs text-base-content/50 max-w-32 truncate">
                      {payment.transactionId}
                    </td>
                    <td className="text-base-content/60 capitalize">
                      {payment.paymentType || "card"}
                    </td>
                    <td className="text-base-content/50 text-xs">
                      {payment.paidAt
                        ? new Date(payment.paidAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${statusBadge[payment.status] || statusBadge.completed}`}
                      >
                        {payment.status || "completed"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FaMoneyBillWave
                        className="text-base-content/20"
                        size={28}
                      />
                      <p className="text-base-content/40 text-sm">
                        No payments recorded yet.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllPaymentHistory;
