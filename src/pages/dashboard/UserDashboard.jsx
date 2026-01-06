import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  FaCar,
  FaClipboardList,
  FaMoneyBillWave,
  FaWallet,
} from "react-icons/fa";
import Loader from "../../components/Loader";

const UserDashboard = () => {
  const axiosSecure = useAxiosSecure();

  const { data = {}, isLoading } = useQuery({
    queryKey: ["user-dashboard-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/user/dashboard-stats");
      return res.data;
    },
  });

  if (isLoading) return <Loader />;

  return (
    <div className="container mx-auto">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-primary text-center">
            User Dashboard
          </h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Active Rentals */}
          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-figure text-primary">
              <FaCar size={28} />
            </div>
            <div className="stat-title">Active Rentals</div>
            <div className="stat-value text-primary">
              {data.activeRentals || data.totalRentals || 0}
            </div>
            <div className="stat-desc">Currently rented cars</div>
          </div>

          {/* Total Rentals */}
          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-figure text-secondary">
              <FaClipboardList size={28} />
            </div>
            <div className="stat-title">Total Rentals</div>
            <div className="stat-value text-secondary">
              {data.totalRentals || 0}
            </div>
            <div className="stat-desc">Lifetime rentals</div>
          </div>

          {/* Payments */}
          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-figure text-success">
              <FaMoneyBillWave size={28} />
            </div>
            <div className="stat-title">Payments</div>
            <div className="stat-value text-success">
              {data.totalPayments || 0}
            </div>
            <div className="stat-desc">Completed payments</div>
          </div>

          {/* Total Spent */}
          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-figure text-warning">
              <FaWallet size={28} />
            </div>
            <div className="stat-title">Total Spent</div>
            <div className="stat-value text-warning">
              ৳ {data.totalSpent || 0}
            </div>
            <div className="stat-desc">Overall rental cost</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold">Need another car?</h3>
            <p className="text-gray-600">
              Browse available cars and rent instantly.
            </p>
          </div>
          <a href="/cars" className="btn btn-primary">
            Explore Cars
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
