import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";
import { FaWallet } from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const RiderPayments = () => {
  const axiosSecure = useAxiosSecure();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure
      .get("/rider/payments")
      .then((res) => setPayments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [axiosSecure]);

  if (loading) return <Loader fullScreen={false} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-base-content">
          Earnings History
        </h2>
        <p className="text-sm text-base-content/50 mt-0.5">
          {payments.length} transactions
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-base-100 rounded-2xl border border-base-300">
          <div className="w-16 h-16 bg-base-200 rounded-2xl flex items-center justify-center mb-4">
            <FaWallet className="text-base-content/30" size={24} />
          </div>
          <p className="font-medium text-base-content">No earnings yet</p>
          <p className="text-sm text-base-content/40 mt-1">
            Payments from your car rentals will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="premium-table w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Transaction ID</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={p._id}>
                    <td className="text-base-content/40">{i + 1}</td>
                    <td>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg capitalize bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
                        {p.paymentType}
                      </span>
                    </td>
                    <td className="text-base-content/60 text-xs">
                      {p.userEmail}
                    </td>
                    <td>
                      {p.amount === 0 ? (
                        <span className="text-emerald-600 font-semibold text-xs">
                          Free
                        </span>
                      ) : (
                        <div className="flex items-center gap-0.5 font-semibold text-base-content">
                          <FaBangladeshiTakaSign className="text-xs text-primary" />
                          <span className="text-sm">{p.amount}</span>
                        </div>
                      )}
                    </td>
                    <td className="font-mono text-xs text-base-content/40 max-w-28 truncate">
                      {p.transactionId}
                    </td>
                    <td className="text-base-content/50 text-xs">
                      {new Date(p.paidAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderPayments;
