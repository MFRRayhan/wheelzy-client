import { motion } from "framer-motion";

import {
  FaCarAlt,
  FaShieldAlt,
  FaCreditCard,
  FaTachometerAlt,
  FaUser,
  FaHeadset,
} from "react-icons/fa";

import { FaArrowUpRightFromSquare } from "react-icons/fa6";

const services = [
  {
    icon: <FaCarAlt size={22} />,
    title: "Car Rental",
    description:
      "Rent cars by the hour or day with flexible pricing and easy instant booking from your dashboard.",
  },
  {
    icon: <FaShieldAlt size={22} />,
    title: "Verified Cars",
    description:
      "Every vehicle on our platform is inspected and verified for safety, reliability, and roadworthiness.",
  },
  {
    icon: <FaCreditCard size={22} />,
    title: "Secure Payments",
    description:
      "Pay safely using our Stripe-powered checkout with full transaction transparency and receipts.",
  },
  {
    icon: <FaTachometerAlt size={22} />,
    title: "Rider Dashboard",
    description:
      "Car owners can manage their listings, track bookings, and view earnings — all in one place.",
  },
  {
    icon: <FaUser size={22} />,
    title: "User Dashboard",
    description:
      "Renters can easily track bookings, review payment history, and manage active rentals anytime.",
  },
  {
    icon: <FaHeadset size={22} />,
    title: "Customer Support",
    description:
      "Dedicated support team ready to assist before, during, and after every rental experience.",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const Services = () => {
  const featuredService = services[0];
  const supportingServices = services.slice(1);

  return (
    <main className="bg-base-100 overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-base-200/60 border-b border-base-300/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-20 sm:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end"
          >
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3 mb-7">
                <span className="w-8 h-[2px] bg-primary" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  The Wheelzy Experience
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-base-content leading-[1.08] tracking-tight max-w-4xl">
                More than a ride.
                <br />
                <span className="text-primary">A better way to move.</span>
              </h1>
            </div>

            <div className="lg:col-span-4 lg:pb-2">
              <p className="text-base sm:text-lg text-base-content/60 leading-relaxed max-w-md">
                From finding your next ride to managing every booking, Wheelzy
                brings essential car rental services together in one seamless
                experience.
              </p>

              <div className="flex items-center gap-3 mt-7">
                <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <FaCarAlt size={16} />
                </span>

                <span className="text-xs font-semibold text-base-content/55 uppercase tracking-wider">
                  Explore our services
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Subtle background detail */}
        <div className="absolute right-0 top-0 w-1/3 h-full bg-primary/[0.025] pointer-events-none" />
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12 sm:mb-14"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              What We Offer
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-base-content tracking-tight mt-3">
              Services designed
              <br className="hidden sm:block" />
              around your journey.
            </h2>
          </div>

          <p className="text-sm sm:text-base text-base-content/55 leading-relaxed max-w-sm">
            Everything you need for a smooth, reliable, and convenient car
            rental experience.
          </p>
        </motion.div>

        {/* Featured Service */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-3xl bg-neutral text-neutral-content mb-6 sm:mb-8"
        >
          <div className="grid md:grid-cols-12 items-center">
            <div className="md:col-span-8 p-7 sm:p-10 lg:p-14 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-[0.16em] mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Featured Service
              </div>

              <div className="w-14 h-14 rounded-2xl bg-primary text-primary-content flex items-center justify-center mb-7">
                {featuredService.icon}
              </div>

              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5">
                {featuredService.title}
              </h3>

              <p className="text-sm sm:text-base text-neutral-content/65 leading-8 max-w-xl">
                {featuredService.description}
              </p>

              <div className="mt-9 flex items-center gap-3 text-primary">
                <span className="text-xs font-bold uppercase tracking-[0.16em]">
                  Your journey starts here
                </span>

                <FaArrowUpRightFromSquare size={12} />
              </div>
            </div>

            <div className="md:col-span-4 relative min-h-52 md:min-h-full flex items-center justify-center p-8">
              <div className="absolute inset-0 bg-primary/[0.04]" />

              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-primary/20 flex items-center justify-center">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-primary/20 flex items-center justify-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <FaCarAlt size={48} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Supporting Services */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5"
        >
          {supportingServices.map((service, index) => (
            <motion.article
              key={service.title}
              variants={cardVariants}
              whileHover={{
                y: -5,
                transition: { duration: 0.25 },
              }}
              className={`group relative overflow-hidden rounded-2xl border border-base-300/80 bg-base-100 p-6 sm:p-7 hover:border-primary/40 hover:shadow-lg hover:shadow-base-content/[0.04] transition-all duration-300 ${
                index === 0 || index === 3 ? "lg:col-span-3" : "lg:col-span-3"
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-content transition-all duration-300">
                  {service.icon}
                </div>

                <span className="text-xs font-semibold text-base-content/25 tracking-widest">
                  0{index + 2}
                </span>
              </div>

              <h3 className="text-xl font-bold text-base-content mb-3 group-hover:text-primary transition-colors duration-300">
                {service.title}
              </h3>

              <p className="text-sm text-base-content/55 leading-7 max-w-lg">
                {service.description}
              </p>

              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-500" />
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* Closing Section */}
      <section className="border-t border-base-300/70 bg-base-200/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.18em] font-bold text-primary mb-2">
                Wheelzy
              </p>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
                Everything in one place.
              </h2>

              <p className="text-sm text-base-content/55 mt-2">
                A simpler way to manage your car rental experience.
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm font-semibold text-base-content/60">
              <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <FaCarAlt />
              </span>

              <span>Drive with confidence.</span>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Services;
