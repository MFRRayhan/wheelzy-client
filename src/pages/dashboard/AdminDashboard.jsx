import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";
import {
  FaUsers,
  FaCar,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave,
} from "react-icons/fa";

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure.get("/admin/dashboard-stats").then((res) => {
      setStats(res.data);
      setLoading(false);
    });
  }, [axiosSecure]);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-primary text-center">
          Admin Dashboard Overview
        </h2>

        <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
          {/* Total Users */}
          <div className="stat">
            <div className="stat-figure text-primary">
              <FaUsers size={26} />
            </div>
            <div className="stat-title">Total Users</div>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>

          {/* Total Cars */}
          <div className="stat">
            <div className="stat-figure text-secondary">
              <FaCar size={26} />
            </div>
            <div className="stat-title">Total Cars</div>
            <div className="stat-value">{stats.totalCars}</div>
          </div>

          {/* Pending Cars */}
          <div className="stat">
            <div className="stat-figure text-warning">
              <FaClock size={26} />
            </div>
            <div className="stat-title">Pending Cars</div>
            <div className="stat-value">{stats.pendingCars}</div>
          </div>

          {/* Approved Cars */}
          <div className="stat">
            <div className="stat-figure text-success">
              <FaCheckCircle size={26} />
            </div>
            <div className="stat-title">Approved Cars</div>
            <div className="stat-value">{stats.approvedCars}</div>
          </div>

          {/* Rejected Cars */}
          <div className="stat">
            <div className="stat-figure text-error">
              <FaTimesCircle size={26} />
            </div>
            <div className="stat-title">Rejected Cars</div>
            <div className="stat-value">{stats.rejectedCars}</div>
          </div>

          {/* Payments */}
          <div className="stat">
            <div className="stat-figure text-success">
              <FaMoneyBillWave size={26} />
            </div>
            <div className="stat-title">Total Payments</div>
            <div className="stat-value">{stats.totalPayments}</div>
            <div className="stat-desc">Revenue: ৳ {stats.totalRevenue}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
