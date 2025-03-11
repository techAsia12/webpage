import React from "react";
import { motion } from "motion/react";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";

const container = (delay) => ({
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, delay: delay },
  },
});

const Hero = () => {
  const mode = useSelector((state) => state.theme.mode);

  return (
    <div className="border-b border-x-neutral-900 pb-4 lg:mb-10">
      <div className="flex flex-wrap ">
        <div className="wrap w-full lg:w-1/2">
          <div className="flex flex-col items-center lg:items-start">
            <motion.h1
              variants={container(0)}
              initial="hidden"
              whileInView="visible"
              className="overflow-hidden pb-16 text-3xl font-thin tracking-tight lg:top-16 lg:text-6xl text-black dark:text-white"
            >
              Empower Your Energy Management with Our Smart Meters
            </motion.h1>
            <motion.span
              variants={container(0.5)}
              initial="hidden"
              whileInView="visible"
              className="bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-lg lg:text-2xl tracking-tight text-transparent"
            >
              Experience real-time monitoring, accurate billing, and seamless
              integration for a smarter, greener future.
            </motion.span>
            <motion.div
              variants={container(1)}
              initial="hidden"
              whileInView="visible"
              className="overflow-hidden my-2 max-w-xl py-6 font-light tracking-tighter"
            >
            </motion.div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 lg:p-8 lg:pt-0">
          <div className="flex justify-center w-full h-full">
            <motion.img
              className="rounded-2xl w-2/3 h-80 md:h-full shadow-lg shadow-black dark:shadow-white"
              initial={{ x: 100, opacity: 0 }} 
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              src="https://res.cloudinary.com/misbackend/image/upload/v1741692125/openart-image_eu1sYUqd_1740215719551_raw_rbalfq.jpg"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
