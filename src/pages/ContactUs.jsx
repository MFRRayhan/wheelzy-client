import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";

const contactInfo = [
  {
    icon: <FaEnvelope size={18} />,
    label: "Email",
    value: "support@wheelzy.com",
    href: "mailto:support@wheelzy.com",
  },
  {
    icon: <FaPhone size={18} />,
    label: "Phone",
    value: "+880 1234-567890",
    href: "tel:+8801234567890",
  },
  {
    icon: <FaMapMarkerAlt size={18} />,
    label: "Location",
    value: "Dhaka, Bangladesh",
    href: null,
  },
];

const ContactUs = () => {
  return (
    <div className="bg-base-100">
      {/* Hero */}
      <section className="bg-base-200 py-30 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-4">
            Get in Touch
          </span>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-base-content mb-5 leading-tight">
            Contact <span className="text-primary">Us</span>
          </h1>

          <p className="text-base-content/60 text-lg leading-relaxed">
            Have questions, feedback, or need assistance? Our team is here to
            help — reach out anytime.
          </p>
        </motion.div>
      </section>

      {/* Contact Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left - Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-7"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Contact Information
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content mt-3 mb-3">
                We'd love to hear from you
              </h2>

              <p className="text-base-content/60 leading-relaxed text-sm">
                Reach out to us for booking support, partnership inquiries, or
                general questions. We aim to respond within 24 hours.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              {contactInfo.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                  className="group flex items-center gap-4 p-4 rounded-2xl border border-base-300 hover:border-primary/30 hover:shadow-sm transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-content transition-all duration-300">
                    {item.icon}
                  </div>

                  {/* Details */}
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-base-content/40 mb-1">
                      {item.label}
                    </p>

                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-sm font-semibold text-base-content group-hover:text-primary transition-colors duration-200 break-words"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-base-content">
                        {item.value}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional Note */}
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
              <h3 className="text-sm font-bold text-base-content mb-1">
                We're here to help!
              </h3>

              <p className="text-sm text-base-content/60 leading-relaxed">
                Whether you need help with a booking or have questions about our
                services, don't hesitate to get in touch.
              </p>
            </div>
          </motion.div>

          {/* Right - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <form className="bg-base-200 border border-base-300 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
              {/* Form Heading */}
              <div className="mb-2">
                <h2 className="text-xl font-bold text-base-content mb-2">
                  Send us a message
                </h2>

                <p className="text-sm text-base-content/55">
                  Fill out the form below and we'll get back to you.
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-base-content/60 uppercase tracking-wide mb-2">
                  Your Name
                </label>

                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full h-12 px-4 bg-base-100 border border-base-300 rounded-xl text-sm text-base-content placeholder:text-base-content/35 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-base-content/60 uppercase tracking-wide mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full h-12 px-4 bg-base-100 border border-base-300 rounded-xl text-sm text-base-content placeholder:text-base-content/35 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-base-content/60 uppercase tracking-wide mb-2">
                  Message
                </label>

                <textarea
                  placeholder="How can we help you?"
                  rows={5}
                  className="w-full px-4 py-3 bg-base-100 border border-base-300 rounded-xl text-sm text-base-content placeholder:text-base-content/35 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="group w-full h-12 bg-primary text-primary-content font-semibold rounded-xl text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <FaPaperPlane
                  size={14}
                  className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-200"
                />
                Send Message
              </motion.button>

              <p className="text-center text-xs text-base-content/40">
                We typically respond within 24 hours.
              </p>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
