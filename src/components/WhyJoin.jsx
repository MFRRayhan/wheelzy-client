import { motion } from "framer-motion";

const features = [
  {
    title: "Wide Car Selection",
    subtitle: "Sedan, SUV, luxury & more",
  },
  {
    title: "Affordable Pricing",
    subtitle: "Transparent daily rental rates",
  },
  {
    title: "Verified Vehicles",
    subtitle: "Well-maintained & inspected cars",
  },
  {
    title: "Easy Booking",
    subtitle: "Quick booking with secure payment",
  },
  {
    title: "Trusted Riders",
    subtitle: "Cars from verified owners only",
  },
  {
    title: "Flexible Rental",
    subtitle: "Hourly, daily & long-term options",
  },
  {
    title: "24/7 Support",
    subtitle: "We are here when you need us",
  },
  {
    title: "Safe & Reliable",
    subtitle: "Your journey, our responsibility",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-base-100 pb-20">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-4xl font-bold mb-4">
            Why Choose <span className="text-primary">Wheelzy</span>?
          </h2>
          <p className="text-base-content/70">
            We make car rental simple, affordable, and reliable so you can focus
            on your journey without worry.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              className="bg-base-200 rounded-2xl p-6 text-center cursor-default shadow-sm hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-base-content/70">{item.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
