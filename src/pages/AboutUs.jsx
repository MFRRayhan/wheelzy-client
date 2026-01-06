import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <section className="bg-base-100 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <h1 className="text-4xl font-bold mb-4">
            About <span className="text-primary">Wheelzy</span>
          </h1>
          <p className="text-base-content/70">
            Wheelzy is a modern car rental platform designed to make vehicle
            booking simple, secure, and affordable for everyone.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
            <p className="text-base-content/70 leading-relaxed mb-4">
              We connect car owners with renters through a trusted digital
              platform. Whether you need a car for daily travel, business, or a
              weekend getaway, Wheelzy gives you reliable options at transparent
              prices.
            </p>
            <p className="text-base-content/70 leading-relaxed">
              Our goal is to simplify the rental experience with verified
              vehicles, secure payments, and responsive customer support.
            </p>
          </div>

          <div className="bg-base-200 rounded-2xl p-8">
            <ul className="space-y-4 font-medium">
              <li>✔ Verified vehicles & riders</li>
              <li>✔ Secure online payments</li>
              <li>✔ Transparent pricing</li>
              <li>✔ Customer-first support</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
