import React from "react";
import Slider from "./Slider";
import { motion } from "motion/react";

const Features = () => {
  return ( 
    <div className="border-b border-x-neutral-900 p-5 lg:mb-10">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex flex-wrap justify-center text-4xl lg:text-6xl text-black dark:text-white font-thin tracking-tight mb-10"
      >
        Features
      </motion.div>
      <Slider />
    </div>
  );
};

export default Features;
