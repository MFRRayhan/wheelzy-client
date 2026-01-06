import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const RiderPayments = () => {
  const axiosSecure = useAxiosSecure();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axiosSecure.get("/rider/payments");
        setPayments(res.data);
      } catch (error) {
        console.error("Error fetching rider payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [axiosSecure]);

  if (loading) return <Loader />;

  if (!payments.length)
    return (
      <div className="text-center py-20 text-error text-2xl">
        No payments found
      </div>
    );

  return (
    <div className="py-10 container mx-auto">
      <h2 className="text-2xl font-bold text-primary mb-6">Payment History</h2>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>Index</th>
              <th>Type</th>
              <th>User</th>
              <th>Amount</th>
              <th>Transaction</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => (
              <tr key={p._id}>
                <td>{i + 1}</td>
                <td>
                  <span className="badge badge-info capitalize text-white font-semibold">
                    {p.paymentType}
                  </span>
                </td>
                <td>{p.userEmail}</td>
                <td>
                  {p.amount === 0 ? (
                    "Free"
                  ) : (
                    <span className="flex items-center gap-1">
                      <FaBangladeshiTakaSign />
                      {p.amount}
                    </span>
                  )}
                </td>

                <td className="text-xs">{p.transactionId}</td>
                <td>{new Date(p.paidAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiderPayments;
