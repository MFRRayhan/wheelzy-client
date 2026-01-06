import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";
import { FaCar, FaRoute, FaMoneyBillWave, FaClock } from "react-icons/fa";

const RiderDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(true);

  const [rentalStats, setRentalStats] = useState({});
  const [earnings, setEarnings] = useState({});
  const [carStats, setCarStats] = useState({});

  useEffect(() => {
    Promise.all([
      axiosSecure.get("/rider/rental-stats"),
      axiosSecure.get("/rider/earnings-summary"),
      axiosSecure.get("/rider/car-summary"),
    ]).then(([rentalRes, earningsRes, carRes]) => {
      setRentalStats(rentalRes.data);
      setEarnings(earningsRes.data);
      setCarStats(carRes.data);
      setLoading(false);
    });
  }, [axiosSecure]);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto">
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-primary text-center">
          Rider Dashboard Overview
        </h2>

        {/* Cars */}
        <div className="stats shadow w-full">
          <div className="stat">
            <FaCar className="text-primary text-2xl" />
            <div className="stat-title">Total Cars</div>
            <div className="stat-value">{carStats.totalCars}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Active Cars</div>
            <div className="stat-value">{carStats.activeCars}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Pending Cars</div>
            <div className="stat-value">{carStats.pendingCars}</div>
          </div>
        </div>

        {/* Rentals */}
        <div className="stats shadow w-full">
          <div className="stat">
            <FaRoute className="text-secondary text-2xl" />
            <div className="stat-title">Total Rentals</div>
            <div className="stat-value">{rentalStats.totalRentals}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Active Rentals</div>
            <div className="stat-value">{rentalStats.activeRentals}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Cancelled</div>
            <div className="stat-value">{rentalStats.cancelledRentals}</div>
          </div>
        </div>

        {/* Earnings */}
        <div className="stats shadow w-full">
          <div className="stat">
            <FaMoneyBillWave className="text-success text-2xl" />
            <div className="stat-title">Today Earnings</div>
            <div className="stat-value">৳ {earnings.todayEarnings}</div>
          </div>
          <div className="stat">
            <FaClock className="text-success text-2xl" />
            <div className="stat-title">Monthly Earnings</div>
            <div className="stat-value">৳ {earnings.monthlyEarnings}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Total Earnings</div>
            <div className="stat-value">৳ {earnings.totalEarnings}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;
