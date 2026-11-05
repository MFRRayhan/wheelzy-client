import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import {
  FaMapMarkerAlt,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { BsFuelPumpDiesel } from "react-icons/bs";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const HeroSlider = ({ cars = [] }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!cars.length || isPaused) return;
    const interval = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % cars.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [cars, isPaused]);

  if (!cars.length) return null;

  const car = cars[index];

  const goTo = (i, dir = 1) => {
    setDirection(dir);
    setIndex(i);
  };

  const prev = () => {
    goTo((index - 1 + cars.length) % cars.length, -1);
  };

  const next = () => {
    goTo((index + 1) % cars.length, 1);
  };

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? "8%" : "-8%",
      opacity: 0,
      scale: 1.03,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? "-8%" : "8%",
      opacity: 0,
      scale: 0.97,
    }),
  };

  return (
    <section
      className="relative h-screen min-h-140 max-h-205 overflow-hidden bg-neutral"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Background image ── */}
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={car._id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0 will-change-transform"
          style={{
            backgroundImage: `url(${car.bannerImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
          }}
        />
      </AnimatePresence>

      {/* ── Gradient overlay — bottom-heavy for text legibility ── */}
      <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-black/20" />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

      {/* ── Content ── */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl w-full mx-auto px-6 sm:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${car._id}`}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="max-w-2xl"
            >
              {/* Category tag */}
              <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
                <BsFuelPumpDiesel className="text-primary text-xs" />
                <span className="text-primary text-xs font-semibold uppercase tracking-wider">
                  {car.carType || "Premium"}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 tracking-tight">
                Drive the Future
                <br />
                <span className="text-accent">with Wheelzy</span>
              </h1>

              {/* Sub headline */}
              <p className="text-base sm:text-lg text-white/75 mb-8 leading-relaxed max-w-lg">
                Experience premium car rentals with verified vehicles,
                transparent pricing, and seamless booking.
              </p>

              {/* Car quick info */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8 text-sm text-white/70">
                <div className="flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-primary text-xs" />
                  <span>{car.location}</span>
                </div>
                {car.rentalFee > 0 && (
                  <div className="flex items-center gap-1">
                    <FaBangladeshiTakaSign className="text-primary text-xs" />
                    <span>
                      <strong className="text-white">{car.rentalFee}</strong>
                      <span className="text-white/50"> / day</span>
                    </span>
                  </div>
                )}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3">
                <Link to={`/cars/${car._id}`}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-primary text-white font-semibold px-7 py-2.5 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow duration-300"
                  >
                    Rent Now
                    <FaArrowRight size={13} />
                  </motion.button>
                </Link>
                <Link to="/cars">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-7 py-2.5 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
                  >
                    View All Cars
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Prev / Next controls ── */}
      <div className="absolute right-6 bottom-1/2 translate-y-1/2 z-20 flex-col gap-2 hidden lg:flex">
        <button
          onClick={prev}
          className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/25 transition-all"
          aria-label="Previous slide"
        >
          <FaChevronLeft size={13} />
        </button>
        <button
          onClick={next}
          className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/25 transition-all"
          aria-label="Next slide"
        >
          <FaChevronRight size={13} />
        </button>
      </div>

      {/* ── Dot indicators ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {cars.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > index ? 1 : -1)}
            className={`transition-all duration-300 rounded-full ${
              i === index
                ? "w-6 h-2 bg-primary"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Slide counter ── */}
      <div className="absolute top-8 right-8 z-20 text-white/50 text-xs font-medium hidden sm:block">
        {String(index + 1).padStart(2, "0")} /{" "}
        {String(cars.length).padStart(2, "0")}
      </div>
    </section>
  );
};

export default HeroSlider;
