import { motion } from "framer-motion";

const services = [
  {
    title: "Car Rental",
    description:
      "Rent cars by the hour or day with flexible pricing and easy booking.",
  },
  {
    title: "Verified Cars",
    description:
      "All vehicles are inspected and verified for safety and reliability.",
  },
  {
    title: "Secure Payments",
    description:
      "Pay safely using trusted online payment gateways with full transparency.",
  },
  {
    title: "Rider Dashboard",
    description:
      "Car owners can manage listings, bookings, and earnings in one place.",
  },
  {
    title: "User Dashboard",
    description: "Track your bookings, payments, and rental history easily.",
  },
  {
    title: "Customer Support",
    description:
      "Dedicated support to assist you before, during, and after your rental.",
  },
];

const Services = () => {
  return (
    <section className="bg-base-200 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h1 className="text-4xl font-bold mb-4">
            Our <span className="text-primary">Services</span>
          </h1>
          <p className="text-base-content/70">
            Everything you need for a smooth and reliable car rental experience.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-base-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all"
            >
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-base-content/70">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
