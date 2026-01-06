import { motion } from "framer-motion";

const ContactUs = () => {
  return (
    <section className="bg-base-100 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h1 className="text-4xl font-bold mb-4">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="text-base-content/70">
            Have questions or need help? Get in touch with our support team.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-base-content/70 mb-6">
              Reach out to us for booking support, partnership inquiries, or
              general questions.
            </p>

            <ul className="space-y-3">
              <li>Email: support@wheelzy.com</li>
              <li>Phone: +880 1234-567890</li>
              <li>Location: Dhaka, Bangladesh</li>
            </ul>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-base-200 p-8 rounded-2xl space-y-4"
          >
            <input
              type="text"
              placeholder="Your Name"
              className="input input-bordered w-full"
              required
            />

            <input
              type="email"
              placeholder="Your Email"
              className="input input-bordered w-full"
              required
            />

            <textarea
              placeholder="Your Message"
              className="textarea textarea-bordered w-full"
              rows="4"
              required
            />

            <button className="btn btn-primary w-full">Send Message</button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
