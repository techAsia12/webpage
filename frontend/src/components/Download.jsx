import { Button } from "@mui/material";
import React, { useState } from "react";
import { motion } from "motion/react";
import DownloadIcon from "@mui/icons-material/Download";
import image from "../assets/phone.png";

const Download = () => {
  return (
    <motion.div 
      className="lg:flex lg:h-fit h-screen items-center justify-center lg:px-0 lg:space-x-20"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 1 }}
    >
      <motion.div 
        className="lg:p-20 w-2/3 dark:text-white"
        initial={{ x: -100, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ duration: 1 }}
      >
        <h1 className="font-bold lg:text-5xl text-xl lg:ml-0 transform translate-x-10 translate-y-20 lg:translate-y-0 lg:translate-x-0">
          For the best experience download our mobile app!
        </h1>
        <br />
        <p className="lg:text-2xl mt-2 lg:ml-0 trnasform translate-x-10 translate-y-20 lg:translate-y-0 lg:translate-x-0">
          Enjoy seamless monitoring, real-time energy tracking, and an optimized
          user experience tailored for your device.
          <br />
          Stay in control of your energy usage anytime, anywhere.
        </p>
        <motion.div 
          initial={{ scale: 0.8 }} 
          animate={{ scale: 1 }} 
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="contained"
            className="border border-neutral-900 w-56 transform lg:translate-y-10 translate-y-32   translate-x-10 lg:translate-x-64 text-9xl text-white hover:bg-white hover:text-black"
            color="primary"
            readOnly
          >
            <DownloadIcon />
            Download
          </Button>
        </motion.div>
      </motion.div>
      
      <motion.img 
        src={image} 
        className="transform lg:-translate-y-20 lg:mt-0 mt-10 hidden lg:block"
        initial={{ y: 50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 1 }}
      />
    </motion.div>
  );
};

export default Download;