import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSearch } from "react-icons/fa";
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

  if (isLoading) return <Loader />;

  if (isError)
    return (
      <div className="text-center py-10 text-red-500 font-semibold">
        {error?.message || "Failed to load payment history"}
      </div>
    );

  if (!payments.length)
    return (
      <div className="text-center py-10 text-2xl text-error font-semibold">
        No payment history found
      </div>
    );

  const filteredPayments = payments.filter((p) =>
    `${p.transactionId} ${p.carName || ""}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-primary">Payment History</h2>

        <div className="w-full md:w-80">
          <div className="input input-bordered flex items-center gap-2">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by transaction or car..."
              className="grow"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>Index</th>
              <th>Transaction ID</th>
              <th>Car</th>
              <th>User</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.length ? (
              filteredPayments.map((p, index) => (
                <tr key={p._id}>
                  <td>{index + 1}</td>
                  <td className="text-xs font-mono">{p.transactionId}</td>
                  <td>{p.carName || "N/A"}</td>
                  <td>{p.userEmail}</td>
                  <td className="font-medium">
                    <div className="flex items-center gap-1">
                      <FaBangladeshiTakaSign />
                      {p.amount}
                    </div>
                  </td>
                  <td>{new Date(p.paidAt).toLocaleDateString("en-GB")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-error font-semibold text-xl"
                >
                  No matching payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
