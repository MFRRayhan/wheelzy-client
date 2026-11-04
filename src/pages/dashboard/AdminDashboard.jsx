import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";
import {
  FaUsers,
  FaCar,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave,
} from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const statCards = (stats) => [
  {
    label: "Total Users",
    value: stats.totalUsers,
    icon: <FaUsers size={20} />,
    iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
    change: "Registered accounts",
    trend: "neutral",
  },
  {
    label: "Total Cars",
    value: stats.totalCars,
    icon: <FaCar size={20} />,
    iconBg:
      "bg-violet-100 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400",
    change: "Listed vehicles",
    trend: "neutral",
  },
  {
    label: "Pending Cars",
    value: stats.pendingCars,
    icon: <FaHourglassHalf size={20} />,
    iconBg:
      "bg-amber-100 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
    change: "Awaiting review",
    trend: "warn",
  },
  {
    label: "Approved Cars",
    value: stats.approvedCars,
    icon: <FaCheckCircle size={20} />,
    iconBg:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
    change: "Active listings",
    trend: "up",
  },
  {
    label: "Rejected Cars",
    value: stats.rejectedCars,
    icon: <FaTimesCircle size={20} />,
    iconBg: "bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400",
    change: "Declined listings",
    trend: "down",
  },
  {
    label: "Total Payments",
    value: stats.totalPayments,
    icon: <FaMoneyBillWave size={20} />,
    iconBg: "bg-primary/10 text-primary",
    change: `৳ ${stats.totalRevenue ?? 0} revenue`,
    trend: "up",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

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

  if (loading) return <Loader fullScreen={false} />;

  const cards = statCards(stats);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-base-content">Overview</h2>
        <p className="text-sm text-base-content/50 mt-0.5">
          Platform statistics at a glance
        </p>
      </div>

      {/* Stats grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
      >
        {cards.map((card, idx) => (
          <motion.div key={idx} variants={cardVariants} className="stat-card">
            {/* Icon */}
            <div className={`stat-card-icon ${card.iconBg}`}>{card.icon}</div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wide mb-1">
                {card.label}
              </p>
              <p className="text-3xl font-extrabold text-base-content">
                {card.value ?? 0}
              </p>
              <p className="text-xs text-base-content/40 mt-1">{card.change}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Revenue highlight */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            Total Revenue
          </p>
          <div className="flex items-baseline gap-1">
            <FaBangladeshiTakaSign className="text-2xl text-base-content" />
            <span className="text-4xl font-extrabold text-base-content">
              {stats.totalRevenue ?? 0}
            </span>
          </div>
          <p className="text-xs text-base-content/50 mt-1">
            From {stats.totalPayments ?? 0} completed payments
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 rounded-xl">
          <FaCheckCircle size={14} />
          Platform healthy
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
