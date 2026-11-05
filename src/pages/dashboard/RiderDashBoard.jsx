import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  FiTruck,
  FiDollarSign,
  FiCreditCard,
  FiRefreshCw,
  FiActivity,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiArrowUpRight,
  FiUser,
} from "react-icons/fi";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaCalendarAlt, FaCar, FaCreditCard } from "react-icons/fa";

// ==================================================
// BRAND COLORS
// Same design system as Admin Dashboard
// ==================================================

const BRAND = "#0F766E";
const BRAND_DARK = "#134E4A";
const BRAND_ACCENT = "#99F6E4";
const BRAND_LIGHT = "#5EEAD4";
const NEUTRAL = "#94A3B8";

// ==================================================
// HELPERS
// ==================================================

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const formatNumber = (number = 0) =>
  new Intl.NumberFormat("en-US").format(Number(number) || 0);

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (email = "") => {
  if (!email) return "NA";

  return email
    .split("@")[0]
    .split(/[._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

const getDisplayName = (user) => {
  return user?.displayName || user?.email?.split("@")[0] || "Rider";
};

const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "approved":
    case "completed":
    case "active":
      return "bg-primary/10 text-primary";

    case "pending":
      return "bg-[#99F6E4]/30 text-[#134E4A] dark:text-[#5EEAD4]";

    case "rejected":
    case "cancelled":
      return "bg-base-300 text-base-content/70";

    default:
      return "bg-base-200 text-base-content/70";
  }
};

// ==================================================
// ANIMATIONS
// ==================================================

const containerVariants = {
  hidden: {
    opacity: 0,
  },

  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },

  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

// ==================================================
// CHART TOOLTIP
// ==================================================

const ChartTooltip = ({ active, payload, label, currency = false }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-base-300 bg-base-100 px-4 py-3 shadow-xl">
      <p className="mb-2 text-xs font-medium text-base-content/50">{label}</p>

      {payload.map((item, index) => (
        <p key={index} className="text-sm font-bold text-base-content">
          {currency ? formatCurrency(item.value) : formatNumber(item.value)}
        </p>
      ))}
    </div>
  );
};

// ==================================================
// SECTION HEADER
// ==================================================

const SectionHeader = ({ title, subtitle, action }) => (
  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
    <div>
      <h2 className="text-lg font-bold tracking-tight text-base-content">
        {title}
      </h2>

      <p className="mt-1 text-sm text-base-content/50">{subtitle}</p>
    </div>

    {action}
  </div>
);

// ==================================================
// STAT CARD
// ==================================================

const StatCard = ({ title, value, description, icon: Icon, index = 0 }) => (
  <motion.div
    variants={itemVariants}
    className="group relative overflow-hidden rounded-2xl border border-base-300/70 bg-base-100 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
  >
    <div
      className="absolute -right-7 -top-7 h-28 w-28 rounded-full opacity-[0.07] transition-transform duration-500 group-hover:scale-150"
      style={{
        backgroundColor: BRAND,
      }}
    />

    <div className="relative flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-base-content/55">{title}</p>

        <h3 className="mt-3 break-words text-2xl font-extrabold tracking-tight text-base-content sm:text-3xl">
          {value}
        </h3>

        <p className="mt-2 text-xs text-base-content/45">{description}</p>
      </div>

      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
        style={{
          backgroundColor: `${BRAND}18`,
          color: BRAND,
        }}
      >
        <Icon size={22} />
      </div>
    </div>

    <div className="mt-5 h-1 overflow-hidden rounded-full bg-base-200">
      <motion.div
        initial={{
          width: 0,
        }}
        animate={{
          width: `${Math.max(20, 75 - index * 7)}%`,
        }}
        transition={{
          duration: 0.8,
          delay: index * 0.1,
        }}
        className="h-full rounded-full"
        style={{
          backgroundColor: BRAND,
        }}
      />
    </div>
  </motion.div>
);

// ==================================================
// CHART CARD
// ==================================================

const ChartCard = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-base-300/70 bg-base-100 p-5 shadow-sm ${className}`}
  >
    {children}
  </div>
);

// ==================================================
// EMPTY STATE
// ==================================================

const EmptyChart = ({ message = "No data available" }) => (
  <div className="flex h-full min-h-52 flex-col items-center justify-center text-center">
    <FiActivity className="mb-3 text-3xl text-base-content/20" />

    <p className="text-sm font-semibold text-base-content/60">{message}</p>
  </div>
);

// ==================================================
// PROGRESS ITEM
// ==================================================

const ProgressItem = ({ label, value, total, icon: Icon }) => {
  const percentage =
    total > 0 ? Math.min((Number(value) / Number(total)) * 100, 100) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {Icon && <Icon size={15} className="shrink-0 text-primary" />}

          <span className="truncate text-sm text-base-content/65">{label}</span>
        </div>

        <span className="text-sm font-bold text-base-content">
          {formatNumber(value)}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-base-200">
        <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width: `${percentage}%`,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="h-full rounded-full bg-primary"
        />
      </div>

      <p className="mt-1.5 text-[11px] text-base-content/40">
        {percentage.toFixed(1)}% of total
      </p>
    </div>
  );
};

// ==================================================
// RIDER DASHBOARD
// ==================================================

const RiderDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ==================================================
  // FETCH DASHBOARD DATA
  // ==================================================

  const fetchDashboardStats = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await axiosSecure.get("/rider/dashboard-stats");

        setStats(response.data);
      } catch (err) {
        console.error("Rider Dashboard Error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load dashboard analytics. Please try again.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [axiosSecure],
  );

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  // ==================================================
  // DASHBOARD DATA
  // ==================================================

  const {
    totalCars = 0,
    approvedCars = 0,
    pendingCars = 0,
    rejectedCars = 0,

    totalRentals = 0,
    activeRentals = 0,
    completedRentals = 0,
    cancelledRentals = 0,

    totalPayments = 0,
    totalEarnings = 0,
    todayEarnings = 0,
    monthlyEarnings = 0,

    monthlyEarningsChart = [],
    monthlyRentals = [],

    rentalStatusDistribution = [],

    recentRentals = [],
    recentPayments = [],
  } = stats || {};

  // ==================================================
  // DERIVED DATA
  // ==================================================

  const hasEarningsData = useMemo(
    () => monthlyEarningsChart.some((item) => Number(item.value) > 0),
    [monthlyEarningsChart],
  );

  const hasRentalData = useMemo(
    () => monthlyRentals.some((item) => Number(item.value) > 0),
    [monthlyRentals],
  );

  const rentalChartData = useMemo(
    () =>
      rentalStatusDistribution.map((item) => ({
        name: item.status?.charAt(0).toUpperCase() + item.status?.slice(1),
        value: Number(item.count) || 0,
      })),
    [rentalStatusDistribution],
  );

  // ==================================================
  // KPI CARDS
  // ==================================================

  const statsCards = [
    {
      title: "Total Vehicles",
      value: formatNumber(totalCars),
      description: "Vehicles listed on Wheelzy",
      icon: FaCar,
    },
    {
      title: "Total Rentals",
      value: formatNumber(totalRentals),
      description: "All recorded rental bookings",
      icon: FaCalendarAlt,
    },
    {
      title: "Active Rentals",
      value: formatNumber(activeRentals),
      description: "Currently active bookings",
      icon: FiActivity,
    },
    {
      title: "Completed Rentals",
      value: formatNumber(completedRentals),
      description: "Successfully completed bookings",
      icon: FiCheckCircle,
    },
    {
      title: "Total Payments",
      value: formatNumber(totalPayments),
      description: "Recorded payment transactions",
      icon: FaCreditCard,
    },
    {
      title: "Total Earnings",
      value: formatCurrency(totalEarnings),
      description: "Total recorded payment amount",
      icon: FiDollarSign,
    },
  ];

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center gap-4">
        <span className="loading loading-spinner loading-lg text-primary" />

        <p className="text-sm font-medium text-base-content/50">
          Preparing your dashboard...
        </p>
      </div>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-8 text-center shadow-sm">
          <FiAlertCircle className="mx-auto mb-4 text-4xl text-error" />

          <h2 className="text-xl font-bold text-base-content">
            Dashboard unavailable
          </h2>

          <p className="mt-2 text-sm leading-6 text-base-content/55">{error}</p>

          <button
            onClick={() => fetchDashboardStats()}
            className="btn btn-primary mt-6 rounded-xl px-6"
          >
            <FiRefreshCw />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==================================================
  // MAIN UI
  // ==================================================

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="min-h-screen space-y-8 bg-base-200/30 px-4 py-6 sm:px-6 lg:px-8"
    >
      {/* ==========================================
          HEADER
      =========================================== */}

      <motion.div
        variants={itemVariants}
        className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"
      >
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />

            <span className="text-xs font-bold uppercase tracking-[0.18em] text-base-content/45">
              Wheelzy Rider Panel
            </span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-base-content sm:text-3xl lg:text-4xl">
            Welcome back, {getDisplayName(user)}
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-base-content/55">
            Manage your vehicles, monitor rental activity, and keep track of
            your earnings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-xl border border-base-300 bg-base-100 px-4 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40">
              Today
            </p>

            <p className="mt-0.5 text-sm font-bold text-base-content">
              {new Date().toLocaleDateString("en-BD", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          <button
            onClick={() => fetchDashboardStats(true)}
            disabled={refreshing}
            className="btn h-11 min-h-11 rounded-xl border-base-300 bg-base-100 px-4 text-base-content shadow-sm hover:bg-base-200"
          >
            <FiRefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </motion.div>

      {/* ==========================================
          EARNINGS OVERVIEW
      =========================================== */}

      <motion.section variants={itemVariants}>
        <div className="relative overflow-hidden rounded-2xl bg-[#134E4A] p-6 text-white shadow-sm sm:p-8">
          <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#99F6E4]/10 blur-3xl" />

          <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-[#5EEAD4]/10 blur-3xl" />

          <div className="relative">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#99F6E4]/15 text-[#99F6E4]">
                    <FiDollarSign size={19} />
                  </div>

                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/55">
                    Earnings Overview
                  </span>
                </div>

                <p className="mt-6 text-sm font-medium text-white/55">
                  Total Recorded Earnings
                </p>

                <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                  {formatCurrency(totalEarnings)}
                </h2>

                <p className="mt-3 max-w-md text-xs leading-5 text-white/45">
                  Your total recorded payment amount from vehicles listed on
                  Wheelzy.
                </p>
              </div>

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#99F6E4]/15 text-[#99F6E4]">
                <FiTrendingUp size={27} />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium text-white/50">
                  Today's Earnings
                </p>

                <p className="mt-2 text-xl font-extrabold">
                  {formatCurrency(todayEarnings)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-white/50">
                  This Month's Earnings
                </p>

                <p className="mt-2 text-xl font-extrabold">
                  {formatCurrency(monthlyEarnings)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-white/50">
                  Total Transactions
                </p>

                <p className="mt-2 text-xl font-extrabold">
                  {formatNumber(totalPayments)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ==========================================
          KPI CARDS
      =========================================== */}

      <section>
        <SectionHeader
          title="Performance Overview"
          subtitle="A quick snapshot of your vehicle rental business"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {statsCards.map((card, index) => (
            <StatCard key={card.title} {...card} index={index} />
          ))}
        </div>
      </section>

      {/* ==========================================
          EARNINGS + RENTAL ANALYTICS
      =========================================== */}

      <section>
        <SectionHeader
          title="Performance Analytics"
          subtitle="Track your earnings and monthly rental activity"
        />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          {/* EARNINGS CHART */}

          <ChartCard className="xl:col-span-2">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-base-content">
                    Earnings Overview
                  </h3>

                  <span className="rounded-md bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
                    6 MONTHS
                  </span>
                </div>

                <p className="mt-1 text-xs text-base-content/45">
                  Monthly recorded payment volume
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-base-content/50">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Earnings
              </div>
            </div>

            <div className="h-[280px] w-full">
              {hasEarningsData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlyEarningsChart}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 5,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="riderEarningsGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor={BRAND} stopOpacity={0.3} />

                        <stop offset="95%" stopColor={BRAND} stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="currentColor"
                      opacity={0.12}
                    />

                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 11,
                        fill: "#888",
                      }}
                      dy={10}
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 11,
                        fill: "#888",
                      }}
                      tickFormatter={(value) =>
                        value >= 1000 ? `${value / 1000}k` : value
                      }
                      width={45}
                    />

                    <Tooltip content={<ChartTooltip currency />} />

                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={BRAND}
                      strokeWidth={3}
                      fill="url(#riderEarningsGradient)"
                      activeDot={{
                        r: 6,
                        fill: BRAND,
                        stroke: "white",
                        strokeWidth: 3,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart message="No earnings recorded in the selected 6-month period" />
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-base-300/70 pt-4">
              <span className="text-xs text-base-content/45">
                Total recorded earnings
              </span>

              <span className="text-lg font-extrabold text-base-content">
                {formatCurrency(totalEarnings)}
              </span>
            </div>
          </ChartCard>

          {/* RENTAL CHART */}

          <ChartCard>
            <div className="mb-6">
              <h3 className="text-base font-bold text-base-content">
                Rental Activity
              </h3>

              <p className="mt-1 text-xs text-base-content/45">
                Monthly rental bookings
              </p>
            </div>

            <div className="h-[280px] w-full">
              {hasRentalData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyRentals}
                    margin={{
                      top: 10,
                      right: 0,
                      left: -20,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="currentColor"
                      opacity={0.12}
                    />

                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 10,
                        fill: "#888",
                      }}
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 11,
                        fill: "#888",
                      }}
                      allowDecimals={false}
                    />

                    <Tooltip content={<ChartTooltip />} />

                    <Bar
                      dataKey="value"
                      fill={BRAND}
                      radius={[6, 6, 0, 0]}
                      maxBarSize={35}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart message="No rental activity in the selected 6-month period" />
              )}
            </div>

            <div className="mt-4 border-t border-base-300/70 pt-4">
              <p className="text-xs text-base-content/45">
                Total recorded rentals
              </p>

              <p className="mt-1 text-xl font-extrabold text-base-content">
                {formatNumber(totalRentals)}
              </p>
            </div>
          </ChartCard>
        </div>
      </section>

      {/* ==========================================
          VEHICLE + RENTAL INSIGHTS
      =========================================== */}

      <section>
        <SectionHeader
          title="Business Insights"
          subtitle="Understand your fleet and rental performance"
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* FLEET STATUS */}

          <ChartCard>
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-base-content">Fleet Status</h3>

                <p className="mt-1 text-xs text-base-content/45">
                  Vehicle approval overview
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FaCar size={19} />
              </div>
            </div>

            <div className="mb-7 flex items-center justify-between rounded-xl bg-base-200/60 p-4">
              <div>
                <p className="text-xs font-medium text-base-content/50">
                  Total Vehicles
                </p>

                <p className="mt-1 text-3xl font-extrabold text-base-content">
                  {formatNumber(totalCars)}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FaCar size={22} />
              </div>
            </div>

            <div className="space-y-6">
              <ProgressItem
                label="Approved Vehicles"
                value={approvedCars}
                total={totalCars}
                icon={FiCheckCircle}
              />

              <ProgressItem
                label="Pending Approval"
                value={pendingCars}
                total={totalCars}
                icon={FiClock}
              />

              <ProgressItem
                label="Rejected Vehicles"
                value={rejectedCars}
                total={totalCars}
                icon={FiXCircle}
              />
            </div>
          </ChartCard>

          {/* RENTAL STATUS */}

          <ChartCard>
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-base-content">Rental Insights</h3>

                <p className="mt-1 text-xs text-base-content/45">
                  Overview of your rental bookings
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FaCalendarAlt size={19} />
              </div>
            </div>

            <div className="mb-7 flex items-center justify-between rounded-xl bg-base-200/60 p-4">
              <div>
                <p className="text-xs font-medium text-base-content/50">
                  Total Rentals
                </p>

                <p className="mt-1 text-3xl font-extrabold text-base-content">
                  {formatNumber(totalRentals)}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FiActivity size={22} />
              </div>
            </div>

            <div className="space-y-6">
              <ProgressItem
                label="Active Rentals"
                value={activeRentals}
                total={totalRentals}
                icon={FiActivity}
              />

              <ProgressItem
                label="Completed Rentals"
                value={completedRentals}
                total={totalRentals}
                icon={FiCheckCircle}
              />

              <ProgressItem
                label="Cancelled Rentals"
                value={cancelledRentals}
                total={totalRentals}
                icon={FiXCircle}
              />
            </div>
          </ChartCard>
        </div>
      </section>

      {/* ==========================================
          RECENT ACTIVITY
      =========================================== */}

      <section>
        <SectionHeader
          title="Recent Activity"
          subtitle="Keep track of your latest payments and rental bookings"
        />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {/* RECENT PAYMENTS */}

          <ChartCard className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-base-300/70 px-5 py-5">
              <div>
                <h3 className="font-bold text-base-content">Recent Payments</h3>

                <p className="mt-1 text-xs text-base-content/45">
                  Latest payment transactions
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FaCreditCard size={19} />
              </div>
            </div>

            <div className="divide-y divide-base-300/60">
              {recentPayments.length ? (
                recentPayments.map((payment) => (
                  <div
                    key={payment._id}
                    className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-base-200/50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                        {getInitials(payment.userEmail)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-base-content">
                          {payment.carName || "Unknown vehicle"}
                        </p>

                        <p className="mt-1 truncate text-xs text-base-content/45">
                          {payment.userEmail || "Customer"}
                        </p>

                        <p className="mt-1 truncate text-[10px] text-base-content/35">
                          {payment.transactionId || "No transaction ID"}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-extrabold text-base-content">
                        {formatCurrency(payment.amount)}
                      </p>

                      <p className="mt-1 text-[11px] text-base-content/45">
                        {formatDate(payment.paidAt)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyChart message="No payment records found" />
              )}
            </div>
          </ChartCard>

          {/* RECENT RENTALS */}

          <ChartCard className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-base-300/70 px-5 py-5">
              <div>
                <h3 className="font-bold text-base-content">Recent Rentals</h3>

                <p className="mt-1 text-xs text-base-content/45">
                  Latest rental bookings
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FaCalendarAlt size={19} />
              </div>
            </div>

            <div className="divide-y divide-base-300/60">
              {recentRentals.length ? (
                recentRentals.map((rental) => (
                  <div
                    key={rental._id}
                    className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-base-200/50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <FaCar size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-base-content">
                          {rental.carName || "Unknown vehicle"}
                        </p>

                        <p className="mt-1 truncate text-xs text-base-content/45">
                          {rental.userEmail || "Customer"}
                        </p>

                        <p className="mt-1 text-[10px] text-base-content/35">
                          {formatDate(rental.rentalDate)}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${getStatusStyle(rental.status)}`}
                      >
                        {rental.status || "Unknown"}
                      </span>

                      <p className="mt-2 text-sm font-extrabold text-base-content">
                        {formatCurrency(rental.rentalFee)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyChart message="No rental records found" />
              )}
            </div>
          </ChartCard>
        </div>
      </section>

      {/* ==========================================
          FLEET SUMMARY
      =========================================== */}

      <motion.section variants={itemVariants}>
        <div className="relative overflow-hidden rounded-2xl bg-[#134E4A] p-6 text-white sm:p-8">
          <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#99F6E4]/10 blur-3xl" />

          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
                  Business Summary
                </p>

                <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                  Your rental business at a glance
                </h2>

                <p className="mt-2 text-sm text-white/55">
                  Keep track of your fleet and rental performance.
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#99F6E4]/15 text-[#99F6E4]">
                <FiTrendingUp size={23} />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                {
                  label: "Approved Vehicles",
                  value: approvedCars,
                  total: totalCars,
                },
                {
                  label: "Active Rentals",
                  value: activeRentals,
                  total: totalRentals,
                },
                {
                  label: "Completed Rentals",
                  value: completedRentals,
                  total: totalRentals,
                },
              ].map((item) => {
                const percentage =
                  item.total > 0 ? (item.value / item.total) * 100 : 0;

                return (
                  <div key={item.label}>
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-white/65">
                        {item.label}
                      </span>

                      <span className="text-xl font-extrabold">
                        {formatNumber(item.value)}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-[#99F6E4] transition-all duration-700"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <p className="mt-2 text-[11px] text-white/45">
                      {percentage.toFixed(1)}% of total
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ==========================================
          FOOTER
      =========================================== */}

      <motion.div
        variants={itemVariants}
        className="flex flex-wrap items-center justify-between gap-3 border-t border-base-300/70 pt-5"
      >
        <p className="text-xs text-base-content/40">Wheelzy Rider Analytics</p>

        <p className="flex items-center gap-2 text-xs text-base-content/40">
          <FiActivity className="text-primary" />
          Dashboard data loaded successfully
        </p>
      </motion.div>
    </motion.div>
  );
};

export default RiderDashboard;
