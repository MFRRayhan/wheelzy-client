import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaLocationDot, FaUser, FaBangladeshiTakaSign } from "react-icons/fa6";
import { BsFuelPumpDiesel } from "react-icons/bs";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const CarCard = ({ car }) => {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group h-full overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-3 shadow-sm transition-shadow duration-300 hover:shadow-lg"
    >
      {/* Car Image */}
      <div className="relative h-48 overflow-hidden rounded-xl bg-base-200">
        <img
          src={car.bannerImage || "/placeholder.jpg"}
          alt={car.carName || "Car"}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Image Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

        {/* Availability Badge */}
        <span className="absolute left-3 top-3 rounded-lg border border-white/20 bg-base-100/90 px-2.5 py-1 text-[11px] font-bold text-base-content shadow-sm backdrop-blur-md">
          {car.isBooked ? "Booked" : "Available"}
        </span>
      </div>

      {/* Car Details */}
      <div className="flex h-[calc(100%-12rem)] flex-col px-1 pt-4">
        {/* Car Name */}
        <h3
          title={car.carName}
          className="truncate text-base font-bold leading-tight text-base-content"
        >
          {car.carName || "Unnamed Car"}
        </h3>

        {/* Car Information */}
        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-base-content/55">
          <div className="flex min-w-0 items-center gap-1.5">
            <BsFuelPumpDiesel className="shrink-0 text-primary" />
            <span className="truncate">{car.carType || "General"}</span>
          </div>

          <div className="flex min-w-0 items-center gap-1">
            <FaLocationDot className="shrink-0 text-primary" />
            <span className="truncate">{car.location || "Location N/A"}</span>
          </div>
        </div>

        {/* Rental Fee and Rider */}
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-base-200 pt-3">
          <div className="flex shrink-0 items-center gap-1 font-bold text-base-content">
            {Number(car.rentalFee) > 0 ? (
              <>
                <FaBangladeshiTakaSign className="text-sm text-primary" />

                <span className="text-lg">
                  {Number(car.rentalFee).toLocaleString("en-BD")}
                </span>

                <span className="ml-0.5 text-[11px] font-normal text-base-content/40">
                  /day
                </span>
              </>
            ) : (
              <span className="text-sm font-semibold text-base-content/60">
                Free
              </span>
            )}
          </div>

          {car.riderName && (
            <div className="flex min-w-0 items-center gap-1 text-xs text-base-content/45">
              <FaUser className="shrink-0 text-primary" />
              <span className="truncate">{car.riderName}</span>
            </div>
          )}
        </div>

        {/* View Details */}
        <div className="mt-auto pt-4">
          <Link
            to={`/cars/${car._id}`}
            className="block w-full rounded-xl bg-primary py-2.5 text-center text-sm font-semibold text-primary-content shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;
