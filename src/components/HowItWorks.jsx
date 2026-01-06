import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Discover Clubs",
    description:
      "Explore a wide range of clubs based on your interests, location, and activities.",
  },
  {
    step: "02",
    title: "Join Easily",
    description:
      "Become a member with a simple signup process and secure payments.",
  },
  {
    step: "03",
    title: "Engage & Grow",
    description:
      "Attend events, connect with members, and grow your community experience.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-base-200 pt-20">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-4xl font-bold mb-4">
            How <span className="text-primary">wheelzy</span> Works
          </h2>
          <p className="text-base-content/70">
            Getting started is simple. Follow these steps to become part of an
            active club community.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ y: -6 }}
              className="bg-base-100 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all"
            >
              {/* Step Number */}
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-primary-content font-bold mb-6">
                {step.step}
              </div>

              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-base-content/70 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
