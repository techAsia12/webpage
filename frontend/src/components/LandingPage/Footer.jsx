import React from "react";
import { motion } from "framer-motion"; // Corrected import from "framer-motion"
import EmailIcon from "@mui/icons-material/Email";

/**
 * Footer Component
 *
 * A footer section that displays contact information, including address, phone number, and email.
 * It uses Framer Motion for animations and supports dark mode.
 *
 * @returns {JSX.Element} - Rendered Footer component
 */
const Footer = () => {
  return (
    <footer
      className="border-b border-neutral-900 pb-20 dark:text-white"
      role="contentinfo"
      aria-label="Contact Information"
    >
      {/* Animated Contact Heading */}
      <motion.h1
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5 }}
        className="my-10 text-center text-4xl"
        role="heading"
        aria-level="2"
        aria-label="Contact Heading"
      >
        Contact
      </motion.h1>

      {/* Contact Details */}
      <div className="text-center tracking-tighter">
        {/* Animated Address */}
        <motion.p
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="my-4"
          aria-label="Address"
        >
          302, Pandurang Smruti CHS, Dawadi Road, Shivsena Shakha, 
          Dombivali East , Pin – 421203
        </motion.p>

        {/* Animated Phone Number */}
        <motion.p
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.5 }}
          className="my-4"
          aria-label="Phone Number"
        >
          +91 7666308198
        </motion.p>

        {/* Animated Email Link */}
        <motion.div
          whileInView={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
        >
          <a
            href={`mailto:info@techasiamechatronics.com`}
            className="border-b"
            aria-label="Email Address"
          >
            <EmailIcon /> info@techasiamechatronics.com
          </a>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
