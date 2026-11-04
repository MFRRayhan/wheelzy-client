import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSearch, FaWallet } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const PaymentHistory = () => {
  const axiosSecure = useAxiosSecure();
  const [searchText, setSearchText] = useState("");

  const {
    data: payments = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user-payments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments/history");
      return res.data;
    },
  });

  if (isLoading) return <Loader fullScreen={false} />;

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-red-500 font-semibold">
          {error?.message || "Failed to load payment history"}
        </p>
      </div>
    );

  const filteredPayments = payments.filter((p) =>
    `${p.transactionId} ${p.carName || ""}`
      .toLowerCase()
      .includes(searchText.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-base-content">
            Payment History
          </h2>
          <p className="text-sm text-base-content/50 mt-0.5">
            {filteredPayments.length} transactions
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/30 text-sm pointer-events-none" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-base-100 border border-base-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-base-100 rounded-2xl border border-base-300">
          <div className="w-16 h-16 bg-base-200 rounded-2xl flex items-center justify-center mb-4">
            <FaWallet className="text-base-content/30" size={24} />
          </div>
          <p className="font-medium text-base-content">No payments yet</p>
          <p className="text-sm text-base-content/40 mt-1">
            Your payment history will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="premium-table w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Transaction ID</th>
                  <th>Car</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length ? (
                  filteredPayments.map((p, index) => (
                    <tr key={p._id}>
                      <td className="text-base-content/40">{index + 1}</td>
                      <td className="font-mono text-xs text-base-content/50">
                        {p.transactionId}
                      </td>
                      <td className="font-medium text-base-content">
                        {p.carName || "N/A"}
                      </td>
                      <td>
                        <div className="flex items-center gap-0.5 font-semibold text-base-content">
                          <FaBangladeshiTakaSign className="text-xs text-primary" />
                          <span className="text-sm">{p.amount}</span>
                        </div>
                      </td>
                      <td className="text-base-content/50 text-xs">
                        {new Date(p.paidAt).toLocaleDateString("en-GB")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-base-content/40 text-sm"
                    >
                      No matching transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
