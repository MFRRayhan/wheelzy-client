import React from "react";
import { Link } from "react-router";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Logo from "./Logo";

const footerLinks = [
  { label: "Browse Cars", to: "/cars" },
  { label: "About Us", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
];

const Footer = () => {
  return (
    <footer className="bg-neutral text-neutral-content">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid gap-10 md:grid-cols-3 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <Logo
              size="md"
              showText
              className="[&_span]:text-white [&_span_span]:text-primary"
            />
            <p className="text-neutral-content/60 leading-relaxed text-sm max-w-xs">
              Wheelzy connects you with the best rental vehicles in Bangladesh.
              Verified cars, transparent pricing, and a seamless booking
              experience — all in one platform.
            </p>
            <div className="flex gap-3">
              {[
                {
                  href: "https://github.com/MFRRayhan",
                  icon: <FaGithub size={17} />,
                  label: "GitHub",
                },
                {
                  href: "https://www.linkedin.com/in/mfr-rayhan",
                  icon: <FaLinkedin size={17} />,
                  label: "LinkedIn",
                },
                {
                  href: "https://twitter.com/MFRRayhan",
                  icon: <FaXTwitter size={17} />,
                  label: "Twitter",
                },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-content/60 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-neutral-content/40">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-neutral-content/60 hover:text-primary transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-neutral-content/40">
              Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-content/60">
              <li>
                <a
                  href="mailto:support@wheelzy.com"
                  className="hover:text-primary transition-colors duration-200"
                >
                  support@wheelzy.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+8801234567890"
                  className="hover:text-primary transition-colors duration-200"
                >
                  +880 1234 567 890
                </a>
              </li>
              <li className="text-neutral-content/40">Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8 max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-content/40">
        <p>&copy; {new Date().getFullYear()} Wheelzy. All rights reserved.</p>
        <p>
          Built by{" "}
          <a
            href="https://github.com/MFRRayhan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            MFR Rayhan
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
