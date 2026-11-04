import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import {
  FaCar,
  FaRoute,
  FaMoneyBillWave,
  FaTimesCircle,
  FaCheckCircle,
  FaHourglassHalf,
} from "react-icons/fa";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const RiderDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
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

  if (loading) return <Loader fullScreen={false} />;

  const carStatItems = [
    {
      label: "Total Cars",
      value: carStats.totalCars ?? 0,
      icon: <FaCar size={20} />,
      iconBg:
        "bg-violet-100 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400",
      sub: "Listed vehicles",
    },
    {
      label: "Active Cars",
      value: carStats.activeCars ?? 0,
      icon: <FaCheckCircle size={20} />,
      iconBg:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
      sub: "Approved listings",
    },
    {
      label: "Pending",
      value: carStats.pendingCars ?? 0,
      icon: <FaHourglassHalf size={20} />,
      iconBg:
        "bg-amber-100 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
      sub: "Awaiting review",
    },
  ];

  const rentalStatItems = [
    {
      label: "Total Rentals",
      value: rentalStats.totalRentals ?? 0,
      icon: <FaRoute size={20} />,
      iconBg:
        "bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
      sub: "All time",
    },
    {
      label: "Active Rentals",
      value: rentalStats.activeRentals ?? 0,
      icon: <FaCheckCircle size={20} />,
      iconBg:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
      sub: "Currently rented",
    },
    {
      label: "Cancelled",
      value: rentalStats.cancelledRentals ?? 0,
      icon: <FaTimesCircle size={20} />,
      iconBg: "bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400",
      sub: "Ended early",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-base-content">
          Rider Overview
          {user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}
        </h2>
        <p className="text-sm text-base-content/50 mt-0.5">
          Track your cars, rentals, and earnings.
        </p>
      </div>

      {/* Earnings highlight */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-neutral rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        {[
          {
            label: "Today's Earnings",
            value: `৳ ${earnings.todayEarnings ?? 0}`,
          },
          { label: "This Month", value: `৳ ${earnings.monthlyEarnings ?? 0}` },
          { label: "All Time", value: `৳ ${earnings.totalEarnings ?? 0}` },
        ].map((item, i) => (
          <div key={i} className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-content/40 mb-1">
              {item.label}
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              {item.value}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Car stats */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider">
          Fleet
        </h3>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
        >
          {carStatItems.map((card, idx) => (
            <motion.div key={idx} variants={cardVariants} className="stat-card">
              <div className={`stat-card-icon ${card.iconBg}`}>{card.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wide mb-1">
                  {card.label}
                </p>
                <p className="text-2xl font-extrabold text-base-content">
                  {card.value}
                </p>
                <p className="text-xs text-base-content/40 mt-0.5">
                  {card.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Rental stats */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider">
          Rentals
        </h3>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
        >
          {rentalStatItems.map((card, idx) => (
            <motion.div key={idx} variants={cardVariants} className="stat-card">
              <div className={`stat-card-icon ${card.iconBg}`}>{card.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wide mb-1">
                  {card.label}
                </p>
                <p className="text-2xl font-extrabold text-base-content">
                  {card.value}
                </p>
                <p className="text-xs text-base-content/40 mt-0.5">
                  {card.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default RiderDashboard;
