import React from "react";
import { motion } from "framer-motion";
import { FaSearch, FaCarAlt, FaRoad } from "react-icons/fa";

const steps = [
  {
    step: "01",
    icon: <FaSearch className="text-primary" size={24} />,
    title: "Find Your Car",
    description:
      "Browse our curated selection of verified vehicles by location, type, and price. Filter to find exactly what fits your journey.",
  },
  {
    step: "02",
    icon: <FaCarAlt className="text-primary" size={24} />,
    title: "Book Instantly",
    description:
      "Choose your car and complete a secure, hassle-free booking in minutes. No hidden fees — transparent pricing always.",
  },
  {
    step: "03",
    icon: <FaRoad className="text-primary" size={24} />,
    title: "Drive & Enjoy",
    description:
      "Pick up your verified vehicle and hit the road with confidence. Track your rental history any time from your dashboard.",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const HowItWorks = () => {
  return (
    <section className="py-20 bg-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content mb-4">
            How <span className="text-primary">Wheelzy</span> Works
          </h2>
          <p className="text-base-content/60 leading-relaxed">
            Getting behind the wheel has never been easier. Three simple steps
            to your next adventure.
          </p>
        </motion.div>

        {/* Steps grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 relative"
        >
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-px bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30 z-0" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="relative z-10 bg-base-100 rounded-2xl p-8 shadow-sm border border-base-300 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              {/* Step number */}
              <div className="absolute -top-4 left-6">
                <span className="bg-primary text-primary-content text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  {step.step}
                </span>
              </div>

              {/* Icon */}
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5 mt-3">
                {step.icon}
              </div>

              <h3 className="text-lg font-bold text-base-content mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-base-content/60 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
