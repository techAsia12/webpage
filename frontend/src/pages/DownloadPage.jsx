import { Button } from "@mui/material";
import React from "react";
import { motion } from "framer-motion";
import DownloadIcon from "@mui/icons-material/Download";
import image from "../assets/phone.png";

const Download = () => {
  return (
    <motion.div
      className="flex flex-col lg:flex-row min-h-screen items-center justify-center lg:p-0 lg:space-x-20 p-4 lg:overflow-hidden lg:-mt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="lg:p-20 w-full lg:w-2/3 dark:text-white text-center lg:text-left"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="font-bold lg:text-5xl text-3xl mb-6">
          For the best experience download our mobile app!
        </h1>
        <p className="lg:text-2xl text-lg mb-8">
          Enjoy seamless monitoring, real-time energy tracking, and an optimized
          user experience tailored for your device.
          <br />
          Stay in control of your energy usage anytime, anywhere.
        </p>
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Button
            variant="contained"
            className="w-56 text-lg hover:bg-gray-400 hover:text-white dark:bg-neutral-950"
            sx={{
              border: "1px solid #ffffff",
              ":hover": {
                backgroundColor:"#374151"
              },
            }}
          >
            <DownloadIcon className="mr-2" />
            Download
          </Button>
        </motion.div>
      </motion.div>

      <motion.img
        src={image}
        className="w-full lg:w-1/4 mt-10 lg:mt-0 lg:block p-5"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        alt="Mobile App"
      />
    </motion.div>
  );
};

export default Download;
