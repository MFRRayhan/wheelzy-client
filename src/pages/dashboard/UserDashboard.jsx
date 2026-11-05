import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  FiCalendar,
  FiDollarSign,
  FiCreditCard,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiActivity,
  FiTrendingUp,
  FiAlertCircle,
  FiUser,
  FiShoppingBag,
  FiClock,
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

// ==================================================
// BRAND COLORS
// Same design system as Admin and Rider Dashboard
// ==================================================

const BRAND = "#0F766E";
const BRAND_DARK = "#134E4A";
const BRAND_ACCENT = "#99F6E4";
const BRAND_LIGHT = "#5EEAD4";

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

const getDisplayName = (user) =>
  user?.displayName || user?.email?.split("@")[0] || "Customer";

const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
    case "completed":
      return "bg-primary/10 text-primary";

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

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-lg font-bold tracking-tight text-base-content">
      {title}
    </h2>

    <p className="mt-1 text-sm text-base-content/50">{subtitle}</p>
  </div>
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
// USER DASHBOARD
// ==================================================

const UserDashboard = () => {
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

        const response = await axiosSecure.get("/user/dashboard-stats");

        setStats(response.data);
      } catch (err) {
        console.error("User Dashboard Error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load your dashboard. Please try again.",
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
    totalRentals = 0,
    activeRentals = 0,
    completedRentals = 0,
    cancelledRentals = 0,

    totalPayments = 0,
    totalSpent = 0,

    monthlySpending = [],
    monthlyRentals = [],

    rentalStatusDistribution = [],

    recentRentals = [],
    recentPayments = [],
  } = stats || {};

  // ==================================================
  // DERIVED DATA
  // ==================================================

  const hasSpendingData = useMemo(
    () => monthlySpending.some((item) => Number(item.value) > 0),
    [monthlySpending],
  );

  const hasRentalData = useMemo(
    () => monthlyRentals.some((item) => Number(item.value) > 0),
    [monthlyRentals],
  );

  const displayName = getDisplayName(user);

  // ==================================================
  // KPI CARDS
  // ==================================================

  const statsCards = [
    {
      title: "Total Rentals",
      value: formatNumber(totalRentals),
      description: "All your rental bookings",
      icon: FiCalendar,
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
      title: "Cancelled Rentals",
      value: formatNumber(cancelledRentals),
      description: "Cancelled bookings",
      icon: FiXCircle,
    },
    {
      title: "Total Payments",
      value: formatNumber(totalPayments),
      description: "Recorded payment transactions",
      icon: FiCreditCard,
    },
    {
      title: "Total Spending",
      value: formatCurrency(totalSpent),
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
              Wheelzy Customer Portal
            </span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-base-content sm:text-3xl lg:text-4xl">
            Welcome back, {displayName}
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-base-content/55">
            Manage your rentals, track your spending, and stay updated with your
            booking activity.
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
          SPENDING OVERVIEW
      =========================================== */}

      <motion.section variants={itemVariants}>
        <div className="relative overflow-hidden rounded-2xl bg-[#134E4A] p-6 text-white shadow-sm sm:p-8">
          <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#99F6E4]/10 blur-3xl" />

          <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-[#5EEAD4]/10 blur-3xl" />

          <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-center">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#99F6E4]/15 text-[#99F6E4]">
                  <FiTrendingUp size={19} />
                </div>

                <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/55">
                  Spending Overview
                </span>
              </div>

              <p className="mt-6 text-sm font-medium text-white/55">
                Total Recorded Spending
              </p>

              <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                {formatCurrency(totalSpent)}
              </h2>

              <p className="mt-3 max-w-md text-xs leading-5 text-white/45">
                Review your rental payments and monitor your spending activity
                from one convenient dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-white/55">
                    Total Bookings
                  </p>

                  <FiCalendar className="text-[#99F6E4]" />
                </div>

                <p className="mt-2 text-2xl font-extrabold">
                  {formatNumber(totalRentals)}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-white/55">
                    Active Rentals
                  </p>

                  <FiActivity className="text-[#99F6E4]" />
                </div>

                <p className="mt-2 text-2xl font-extrabold">
                  {formatNumber(activeRentals)}
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
          title="Your Overview"
          subtitle="A quick snapshot of your rental account"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {statsCards.map((card, index) => (
            <StatCard key={card.title} {...card} index={index} />
          ))}
        </div>
      </section>

      {/* ==========================================
          SPENDING + RENTAL ANALYTICS
      =========================================== */}

      <section>
        <SectionHeader
          title="Performance Analytics"
          subtitle="Understand your monthly spending and rental activity"
        />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          {/* MONTHLY SPENDING */}

          <ChartCard className="xl:col-span-2">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-base-content">
                    Monthly Spending
                  </h3>

                  <span className="rounded-md bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
                    6 MONTHS
                  </span>
                </div>

                <p className="mt-1 text-xs text-base-content/45">
                  Your monthly recorded payment activity
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-base-content/50">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Spending
              </div>
            </div>

            <div className="h-[280px] w-full">
              {hasSpendingData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlySpending}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 5,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="userSpendingGradient"
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
                      fill="url(#userSpendingGradient)"
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
                <EmptyChart message="No spending recorded in the selected 6-month period" />
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-base-300/70 pt-4">
              <span className="text-xs text-base-content/45">
                Total recorded spending
              </span>

              <span className="text-lg font-extrabold text-base-content">
                {formatCurrency(totalSpent)}
              </span>
            </div>
          </ChartCard>

          {/* MONTHLY RENTALS */}

          <ChartCard>
            <div className="mb-6">
              <h3 className="text-base font-bold text-base-content">
                Rental Activity
              </h3>

              <p className="mt-1 text-xs text-base-content/45">
                Your monthly booking history
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
          RENTAL STATUS
      =========================================== */}

      <section>
        <SectionHeader
          title="Rental Insights"
          subtitle="Monitor the status of your rental bookings"
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* BOOKING SUMMARY */}

          <ChartCard>
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-base-content">
                  Booking Status Overview
                </h3>

                <p className="mt-1 text-xs text-base-content/45">
                  Distribution of your rental records
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FiCalendar size={19} />
              </div>
            </div>

            <div className="mb-7 flex items-center justify-between rounded-xl bg-base-200/60 p-4">
              <div>
                <p className="text-xs font-medium text-base-content/50">
                  Total Bookings
                </p>

                <p className="mt-1 text-3xl font-extrabold text-base-content">
                  {formatNumber(totalRentals)}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FiShoppingBag size={22} />
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

          {/* PAYMENT SUMMARY */}

          <ChartCard>
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-base-content">Payment Summary</h3>

                <p className="mt-1 text-xs text-base-content/45">
                  Your recorded payment overview
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FiCreditCard size={19} />
              </div>
            </div>

            <div className="rounded-xl bg-base-200/60 p-5">
              <p className="text-xs font-medium text-base-content/50">
                Total Recorded Spending
              </p>

              <p className="mt-2 text-3xl font-extrabold text-base-content">
                {formatCurrency(totalSpent)}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-base-300/70 pt-4">
                <span className="text-sm text-base-content/55">
                  Total Transactions
                </span>

                <span className="text-sm font-extrabold text-base-content">
                  {formatNumber(totalPayments)}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm text-base-content/65">
                    Average Payment
                  </span>

                  <span className="text-sm font-bold text-base-content">
                    {formatCurrency(
                      totalPayments > 0 ? totalSpent / totalPayments : 0,
                    )}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-base-200">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: totalPayments > 0 ? "100%" : "0%",
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-base-300/70 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FiDollarSign size={19} />
                </div>

                <div>
                  <p className="text-sm font-bold text-base-content">
                    Payment Activity
                  </p>

                  <p className="mt-1 text-xs text-base-content/45">
                    {totalPayments > 0
                      ? `${formatNumber(totalPayments)} recorded transactions`
                      : "No payment transactions recorded yet"}
                  </p>
                </div>
              </div>
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
          subtitle="Your latest payments and rental bookings"
        />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {/* RECENT PAYMENTS */}

          <ChartCard className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-base-300/70 px-5 py-5">
              <div>
                <h3 className="font-bold text-base-content">Recent Payments</h3>

                <p className="mt-1 text-xs text-base-content/45">
                  Your latest payment transactions
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FiCreditCard size={19} />
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
                        {getInitials(payment.riderEmail || payment.carName)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-base-content">
                          {payment.carName || "Unknown vehicle"}
                        </p>

                        <p className="mt-1 truncate text-xs text-base-content/45">
                          {payment.transactionId || "Payment record"}
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
                  Your latest vehicle bookings
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FiCalendar size={19} />
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
                        <FiShoppingBag size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-base-content">
                          {rental.carName || "Unknown vehicle"}
                        </p>

                        <p className="mt-1 text-xs text-base-content/45">
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
          CUSTOMER SUMMARY
      =========================================== */}

      <motion.section variants={itemVariants}>
        <div className="relative overflow-hidden rounded-2xl bg-[#134E4A] p-6 text-white sm:p-8">
          <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#99F6E4]/10 blur-3xl" />

          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
                  Account Summary
                </p>

                <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                  Your Wheelzy activity at a glance
                </h2>

                <p className="mt-2 text-sm text-white/55">
                  A summary of your rental and payment activity.
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#99F6E4]/15 text-[#99F6E4]">
                <FiUser size={23} />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
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
                {
                  label: "Payment Transactions",
                  value: totalPayments,
                  total: totalPayments,
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
        <p className="text-xs text-base-content/40">
          Wheelzy Customer Analytics
        </p>

        <p className="flex items-center gap-2 text-xs text-base-content/40">
          <FiActivity className="text-primary" />
          Dashboard data loaded successfully
        </p>
      </motion.div>
    </motion.div>
  );
};

export default UserDashboard;
