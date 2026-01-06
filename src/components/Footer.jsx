import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Logo from "./logo";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo />
            </div>
            <p className="text-gray-400 leading-relaxed">
              Discover, rent, and manage cars effortlessly. Wheelzy connects
              people with the best vehicles while ensuring safety and
              convenience.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold mb-2 text-white">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                Email:{" "}
                <a
                  href="mailto:support@wheelzy.com"
                  className="hover:text-primary transition-colors"
                >
                  support@wheelzy.com
                </a>
              </li>
              <li>
                Phone:{" "}
                <a
                  href="tel:+8801234567890"
                  className="hover:text-primary transition-colors"
                >
                  +880 1234 567 890
                </a>
              </li>
              <li>Location: Dhaka, Bangladesh</li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold mb-2 text-white">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://github.com/MFRRayhan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-800 hover:bg-primary hover:text-white transition-all shadow-md hover:shadow-lg"
              >
                <FaGithub size={20} />
              </a>

              <a
                href="https://www.linkedin.com/in/mfr-rayhan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-800 hover:bg-primary hover:text-white transition-all shadow-md hover:shadow-lg"
              >
                <FaLinkedin size={20} />
              </a>

              <a
                href="https://twitter.com/MFRRayhan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-800 hover:bg-primary hover:text-white transition-all shadow-md hover:shadow-lg"
              >
                <FaXTwitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-14 border-t border-gray-700 pt-6 text-center text-sm text-gray-500 space-y-1">
          <p>&copy; {new Date().getFullYear()} Wheelzy. All rights reserved.</p>
          <p>
            Developed by{" "}
            <a
              href="https://github.com/MFRRayhan"
              className="text-primary font-semibold hover:underline"
            >
              MFR Rayhan
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
