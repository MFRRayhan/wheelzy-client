import React from "react";
import { motion } from "framer-motion";
import {
  FaCar,
  FaTag,
  FaShieldAlt,
  FaBolt,
  FaUserCheck,
  FaClock,
  FaHeadset,
  FaHeart,
} from "react-icons/fa";

const features = [
  {
    icon: <FaCar size={22} />,
    title: "Wide Car Selection",
    subtitle: "Sedan, SUV, luxury & more",
  },
  {
    icon: <FaTag size={22} />,
    title: "Affordable Pricing",
    subtitle: "Transparent daily rental rates",
  },
  {
    icon: <FaShieldAlt size={22} />,
    title: "Verified Vehicles",
    subtitle: "Well-maintained & inspected cars",
  },
  {
    icon: <FaBolt size={22} />,
    title: "Easy Booking",
    subtitle: "Quick booking with secure payment",
  },
  {
    icon: <FaUserCheck size={22} />,
    title: "Trusted Riders",
    subtitle: "Cars from verified owners only",
  },
  {
    icon: <FaClock size={22} />,
    title: "Flexible Rental",
    subtitle: "Hourly, daily & long-term options",
  },
  {
    icon: <FaHeadset size={22} />,
    title: "24/7 Support",
    subtitle: "We are here when you need us",
  },
  {
    icon: <FaHeart size={22} />,
    title: "Safe & Reliable",
    subtitle: "Your journey, our responsibility",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

const WhyJoin = () => {
  return (
    <section className="py-20 bg-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Why Us
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content mb-4">
            Why Choose <span className="text-primary">Wheelzy</span>?
          </h2>

          <p className="text-base-content/60 leading-relaxed">
            We make car rental simple, affordable, and reliable - so you can
            focus on your journey without worry.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 },
              }}
              className="group bg-base-100 border border-base-300 rounded-2xl p-6 flex flex-col gap-4 cursor-default shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-content transition-all duration-300">
                {item.icon}
              </div>

              {/* Content */}
              <div>
                <h3 className="text-base font-semibold text-base-content mb-1 group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>

                <p className="text-sm text-base-content/55 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyJoin;
