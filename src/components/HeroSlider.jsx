import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";

const HeroSlider = ({ cars = [] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!cars.length) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % cars.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [cars]);

  if (!cars.length) return null;

  const car = cars[index];

  return (
    <section className="relative min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={car._id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${car.bannerImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6"
          >
            Drive the Future with <span className="text-warning">Wheelzy</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-gray-200 max-w-2xl mb-8"
          >
            Rent premium cars in {car.location}. Experience comfort, power, and
            freedom with our verified {car.carType} collection.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4"
          >
            <Link to={`/cars/${car._id}`}>
              <button className="btn btn-primary px-8 text-white">
                Rent Now
              </button>
            </Link>
            <Link to="/cars">
              <button className="btn btn-outline btn-warning">
                View All Cars
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
