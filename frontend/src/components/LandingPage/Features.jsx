import React from "react";
import Slider from "./Slider";
import { motion } from "framer-motion"; // Corrected import from "framer-motion"

/**
 * Features Component
 * 
 * A section that displays a title ("Features") and a slider component.
 * It uses Framer Motion for animations and supports dark mode.
 * 
 * @returns {JSX.Element} - Rendered Features component
 */
const Features = () => {
  return (
    <section
      className="border-b border-x-neutral-900 p-5 lg:mb-10"
      role="region"
      aria-label="Features Section"
    >
      {/* Animated Title */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex flex-wrap justify-center text-4xl lg:text-6xl text-black dark:text-white font-thin tracking-tight mb-10"
        role="heading"
        aria-level="2"
        aria-label="Features Title"
      >
        Features
      </motion.div>

      {/* Slider Component */}
      <Slider />
    </section>
  );
};

export default Features;