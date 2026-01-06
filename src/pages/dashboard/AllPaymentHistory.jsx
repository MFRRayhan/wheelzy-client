import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";
import { FaSearch } from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const AllPaymentHistory = () => {
  const axiosSecure = useAxiosSecure();
  const [searchText, setSearchText] = useState("");

  // Fetch all payments for admin
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["adminPayments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/payments");
      return res.data;
    },
  });

  if (isLoading) return <Loader />;

  // Filter payments by user email or transactionId
  const filteredPayments = payments.filter(
    (p) =>
      p.userEmail.toLowerCase().includes(searchText.toLowerCase()) ||
      p.transactionId.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="py-10 mx-auto container">
      {/* Section Title + Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <h2 className="text-2xl font-bold text-primary">All Payment History</h2>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-20" />
          <input
            type="text"
            placeholder="Search by email or transaction ID..."
            className="input input-bordered w-full pl-10"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {/* Payment Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>Index</th>
              <th>User Email</th>
              <th>Amount</th>
              <th>Transaction ID</th>
              <th>Payment Type</th>
              <th>Paid At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment, index) => (
                <tr key={payment._id}>
                  <td>{index + 1}</td>
                  <td>{payment.userEmail}</td>
                  <td>
                    {payment.amount === 0 ? (
                      "Free"
                    ) : (
                      <div className="flex items-center gap-1">
                        <FaBangladeshiTakaSign /> {payment.amount}
                      </div>
                    )}
                  </td>

                  <td>{payment.transactionId}</td>
                  <td>{payment.paymentType || "N/A"}</td>
                  <td>
                    {payment.paidAt
                      ? new Date(payment.paidAt).toLocaleString()
                      : "-"}
                  </td>
                  <td className="capitalize">
                    {payment.status || "completed"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-error font-semibold text-2xl"
                >
                  No payments have been recorded for any members yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllPaymentHistory;
