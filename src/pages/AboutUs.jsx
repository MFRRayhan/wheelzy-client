import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

import {
  FaCheckCircle,
  FaUsers,
  FaCar,
  FaMapMarkerAlt,
  FaSmile,
  FaShieldAlt,
  FaCreditCard,
  FaTags,
  FaHeadset,
  FaArrowRight,
  FaCheck,
} from "react-icons/fa";

// ============================================
// Animation Variants
// ============================================

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

// ============================================
// Count Up Hook
// ============================================

function useCountUp(target, { duration = 2, delay = 0 } = {}) {
  const motionValue = useMotionValue(0);
  const ref = useRef(null);

  const isInView = useInView(ref, {
    once: true,
    margin: "0px 0px -60px 0px",
  });

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(motionValue, target, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
    });

    return () => controls.stop();
  }, [isInView, motionValue, target, duration, delay]);

  const formattedValue = useTransform(motionValue, (value) =>
    Math.round(value).toLocaleString("en-US"),
  );

  return { ref, formattedValue };
}

// ============================================
// Statistics Data
// Replace illustrative values with real data.
// ============================================

const stats = [
  {
    target: 500,
    suffix: "+",
    label: "Cars Listed",
    description: "Vehicles across different categories",
    icon: <FaCar />,
  },
  {
    target: 1200,
    suffix: "+",
    label: "Happy Renters",
    description: "Customers who completed a rental",
    icon: <FaUsers />,
  },
  {
    target: 15,
    suffix: "+",
    label: "Cities Covered",
    description: "Expanding across Bangladesh",
    icon: <FaMapMarkerAlt />,
  },
  {
    target: 98,
    suffix: "%",
    label: "Satisfaction Rate",
    description: "Based on customer feedback",
    icon: <FaSmile />,
  },
];

// ============================================
// Individual Statistics Card
// ============================================

const StatCard = ({ stat, index }) => {
  const { ref, formattedValue } = useCountUp(stat.target, {
    duration: 2,
    delay: index * 0.12,
  });

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      whileHover={{
        y: -5,
        transition: { duration: 0.25 },
      }}
      className="
        group relative overflow-hidden
        rounded-2xl border border-base-300/70
        bg-base-100 p-5 sm:p-6
        shadow-sm transition-all duration-300
        hover:border-primary/40
        hover:shadow-xl hover:shadow-primary/5
      "
    >
      {/* Decorative Background */}
      <div
        className="
          pointer-events-none absolute -right-10 -top-10
          h-32 w-32 rounded-full
          bg-primary/5 blur-2xl
          transition-all duration-500
          group-hover:bg-primary/10
        "
      />

      {/* Icon */}
      <div className="relative mb-6 flex items-center justify-between">
        <div
          className="
            flex h-12 w-12 items-center justify-center
            rounded-xl bg-primary/10 text-primary
            transition-all duration-300
            group-hover:bg-primary/15
            group-hover:scale-105
          "
        >
          <span className="text-xl">{stat.icon}</span>
        </div>

        <span
          className="
            h-2 w-2 rounded-full
            bg-primary/40
            transition-all duration-300
            group-hover:bg-primary
          "
        />
      </div>

      {/* Counter */}
      <div className="relative">
        <div className="flex items-baseline gap-1">
          <motion.span
            className="
              text-3xl font-extrabold tracking-tight
              text-base-content tabular-nums
              sm:text-4xl
            "
          >
            {formattedValue}
          </motion.span>

          <span className="text-2xl font-bold text-primary">{stat.suffix}</span>
        </div>

        <h3 className="mt-3 text-base font-bold text-base-content">
          {stat.label}
        </h3>

        <p className="mt-1 text-sm leading-relaxed text-base-content/50">
          {stat.description}
        </p>
      </div>

      {/* Bottom Accent */}
      <div
        className="
          absolute bottom-0 left-6 right-6
          h-px bg-base-300/70
          transition-colors duration-300
          group-hover:bg-primary
        "
      />
    </motion.div>
  );
};

// ============================================
// Highlights Data
// ============================================

const highlights = [
  {
    icon: <FaShieldAlt />,
    title: "Trusted & Verified",
    description: "Verified vehicles and trusted rental partners.",
  },
  {
    icon: <FaCreditCard />,
    title: "Secure Payments",
    description: "Convenient and secure online payments via Stripe.",
  },
  {
    icon: <FaTags />,
    title: "Transparent Pricing",
    description: "Clear pricing with no unexpected hidden fees.",
  },
  {
    icon: <FaHeadset />,
    title: "Dedicated Support",
    description: "Customer-focused assistance whenever you need it.",
  },
];

// ============================================
// About Us Page
// ============================================

const AboutUs = () => {
  return (
    <main className="overflow-hidden bg-base-100">
      {/* ======================================
          HERO SECTION
      ====================================== */}

      <section className="relative isolate overflow-hidden bg-neutral px-4 py-24 sm:py-28 lg:py-32">
        {/* Background Decorations */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent" />

          <div
            className="
              absolute -right-32 -top-32
              h-96 w-96 rounded-full
              border border-primary/10
            "
          />

          <div
            className="
              absolute -right-20 -top-20
              h-72 w-72 rounded-full
              border border-primary/10
            "
          />

          <div
            className="
              absolute -bottom-40 -left-40
              h-96 w-96 rounded-full
              bg-primary/5 blur-3xl
            "
          />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Eyebrow */}
            <div
              className="
                mb-6 inline-flex items-center gap-2
                rounded-full border border-primary/20
                bg-primary/10 px-4 py-2
              "
            >
              <span className="h-2 w-2 rounded-full bg-primary" />

              <span
                className="
                  text-xs font-bold uppercase
                  tracking-[0.2em] text-primary
                "
              >
                Discover Wheelzy
              </span>
            </div>

            {/* Heading */}
            <h1
              className="
                text-4xl font-extrabold leading-tight
                tracking-tight text-white
                sm:text-5xl lg:text-6xl
              "
            >
              Redefining the Way
              <br className="hidden sm:block" />
              <span className="text-primary"> You Rent a Car</span>
            </h1>

            {/* Description */}
            <p
              className="
                mx-auto mt-7 max-w-2xl
                text-base leading-relaxed
                text-neutral-content/60
                sm:text-lg
              "
            >
              Wheelzy is a modern car rental platform designed to make vehicle
              booking simple, secure, and affordable. We connect people with the
              right vehicles for every journey.
            </p>

            {/* Bottom Indicator */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="
                mx-auto mt-10 h-1 w-20
                origin-center rounded-full bg-primary
              "
            />
          </motion.div>
        </div>
      </section>

      {/* ======================================
          STATISTICS SECTION
      ====================================== */}

      <section className="relative border-b border-base-200 bg-base-100">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          {/* Section Heading */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <span
              className="
                mb-3 inline-block text-xs
                font-bold uppercase
                tracking-[0.2em] text-primary
              "
            >
              By the Numbers
            </span>

            <h2
              className="
                text-3xl font-extrabold
                tracking-tight text-base-content
                sm:text-4xl
              "
            >
              Wheelzy in Numbers
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-base-content/50 sm:text-base">
              Every number represents our commitment to making car rental
              simpler and more accessible.
            </p>
          </motion.div>

          {/* Statistics Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
            className="
              grid grid-cols-2 gap-4
              sm:gap-5 lg:grid-cols-4
            "
          >
            {stats.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ======================================
          WHO WE ARE SECTION
      ====================================== */}

      <section className="relative bg-base-100">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left Content */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span
                className="
                  mb-4 block text-xs font-bold
                  uppercase tracking-[0.2em] text-primary
                "
              >
                Who We Are
              </span>

              <h2
                className="
                  max-w-xl text-3xl font-extrabold
                  leading-tight tracking-tight
                  text-base-content sm:text-4xl
                "
              >
                Connecting People with the
                <span className="text-primary"> Right Vehicles</span>
              </h2>

              <div className="mt-7 space-y-5">
                <p className="text-base leading-8 text-base-content/60">
                  We connect car owners with renters through a trusted digital
                  platform. Whether you need a car for daily travel, business
                  trips, or a weekend getaway, Wheelzy gives you reliable
                  options at transparent prices.
                </p>

                <p className="text-base leading-8 text-base-content/60">
                  Our goal is to simplify the rental experience with verified
                  vehicles, secure payments, and responsive customer support, so
                  you can focus entirely on your journey.
                </p>
              </div>

              {/* Small Highlight */}
              <div className="mt-9 flex items-center gap-3">
                <div
                  className="
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-xl bg-primary text-primary-content
                  "
                >
                  <FaCheck size={17} />
                </div>

                <div>
                  <p className="text-sm font-bold text-base-content">
                    Your Journey, Our Priority
                  </p>

                  <p className="mt-0.5 text-xs text-base-content/50">
                    Making every booking experience easier.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Visual Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
              className="relative"
            >
              <div
                className="
                  absolute -right-4 -top-4
                  h-full w-full rounded-3xl
                  border border-primary/20
                "
              />

              <div
                className="
                  relative overflow-hidden rounded-3xl
                  border border-base-300/60
                  bg-base-200 p-7 sm:p-10
                "
              >
                {/* Decorative Elements */}
                <div
                  className="
                    absolute -right-16 -top-16
                    h-56 w-56 rounded-full
                    bg-primary/10 blur-3xl
                  "
                />

                <div className="relative">
                  <div
                    className="
                      mb-8 flex h-14 w-14
                      items-center justify-center
                      rounded-2xl bg-primary/10
                      text-2xl text-primary
                    "
                  >
                    <FaCar />
                  </div>

                  <span
                    className="
                      text-xs font-bold uppercase
                      tracking-[0.2em] text-primary
                    "
                  >
                    Our Mission
                  </span>

                  <h3
                    className="
                      mt-4 text-2xl font-extrabold
                      leading-snug text-base-content
                      sm:text-3xl
                    "
                  >
                    Making Every Journey
                    <span className="text-primary"> Better</span>
                  </h3>

                  <p className="mt-5 max-w-md leading-relaxed text-base-content/60">
                    We believe renting a vehicle should be simple, transparent,
                    and accessible. Wheelzy brings vehicle owners and renters
                    together through one convenient platform.
                  </p>

                  <div className="mt-9 h-px w-full bg-base-300" />

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-base-content">
                        Simple. Secure. Reliable.
                      </p>

                      <p className="mt-1 text-xs text-base-content/50">
                        The Wheelzy experience.
                      </p>
                    </div>

                    <div
                      className="
                        flex h-11 w-11 shrink-0
                        items-center justify-center
                        rounded-full bg-primary
                        text-primary-content
                      "
                    >
                      <FaArrowRight />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================
          WHY CHOOSE WHEELZY
      ====================================== */}

      <section className="border-y border-base-200 bg-base-200/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
          {/* Heading */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <span
              className="
                mb-3 inline-block text-xs
                font-bold uppercase
                tracking-[0.2em] text-primary
              "
            >
              The Wheelzy Advantage
            </span>

            <h2
              className="
                text-3xl font-extrabold
                tracking-tight text-base-content
                sm:text-4xl
              "
            >
              Why Choose Wheelzy?
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-base-content/50 sm:text-base">
              Everything you need for a smoother, more convenient car rental
              experience.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="
              grid grid-cols-1 gap-5
              sm:grid-cols-2 lg:grid-cols-4
            "
          >
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                className="
                  group rounded-2xl
                  border border-base-300/70
                  bg-base-100 p-6
                  shadow-sm transition-all duration-300
                  hover:border-primary/40
                  hover:shadow-lg hover:shadow-primary/5
                "
              >
                <div
                  className="
                    mb-6 flex h-12 w-12
                    items-center justify-center
                    rounded-xl bg-primary/10
                    text-xl text-primary
                    transition-colors duration-300
                    group-hover:bg-primary/15
                  "
                >
                  {item.icon}
                </div>

                <h3 className="text-base font-bold text-base-content">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-base-content/50">
                  {item.description}
                </p>

                <div
                  className="
                    mt-6 h-0.5 w-8 rounded-full
                    bg-primary/40
                    transition-all duration-300
                    group-hover:w-14 group-hover:bg-primary
                  "
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
