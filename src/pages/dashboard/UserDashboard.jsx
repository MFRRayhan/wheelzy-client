import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { motion } from "framer-motion";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import {
  FaCar,
  FaClipboardList,
  FaMoneyBillWave,
  FaWallet,
  FaArrowRight,
} from "react-icons/fa";
import Loader from "../../components/Loader";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const UserDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data = {}, isLoading } = useQuery({
    queryKey: ["user-dashboard-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/user/dashboard-stats");
      return res.data;
    },
  });

  if (isLoading) return <Loader fullScreen={false} />;

  const statItems = [
    {
      label: "Active Rentals",
      value: data.activeRentals ?? data.totalRentals ?? 0,
      icon: <FaCar size={20} />,
      iconBg: "bg-primary/10 text-primary",
      sub: "Currently rented",
    },
    {
      label: "Total Rentals",
      value: data.totalRentals ?? 0,
      icon: <FaClipboardList size={20} />,
      iconBg:
        "bg-violet-100 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400",
      sub: "Lifetime bookings",
    },
    {
      label: "Payments Made",
      value: data.totalPayments ?? 0,
      icon: <FaMoneyBillWave size={20} />,
      iconBg:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
      sub: "Completed transactions",
    },
    {
      label: "Total Spent",
      value: `৳ ${data.totalSpent ?? 0}`,
      icon: <FaWallet size={20} />,
      iconBg:
        "bg-amber-100 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
      sub: "Overall rental cost",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-base-content">
          Welcome back
          {user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}!
        </h2>
        <p className="text-sm text-base-content/50 mt-0.5">
          Here's an overview of your rental activity.
        </p>
      </div>

      {/* Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
      >
        {statItems.map((card, idx) => (
          <motion.div key={idx} variants={cardVariants} className="stat-card">
            <div className={`stat-card-icon ${card.iconBg}`}>{card.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wide mb-1">
                {card.label}
              </p>
              <p className="text-2xl font-extrabold text-base-content">
                {card.value}
              </p>
              <p className="text-xs text-base-content/40 mt-0.5">{card.sub}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-neutral rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <p className="text-white font-bold text-lg mb-1">
            Ready for your next journey?
          </p>
          <p className="text-neutral-content/60 text-sm">
            Browse available cars and book instantly.
          </p>
        </div>
        <Link
          to="/cars"
          className="flex items-center gap-2 bg-primary text-primary-content font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-md hover:shadow-lg flex-shrink-0"
        >
          Explore Cars
          <FaArrowRight size={13} />
        </Link>
      </motion.div>
    </div>
  );
};

export default UserDashboard;
