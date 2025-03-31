import { Button } from "@mui/material";
import React from "react";
import { motion } from "framer-motion";
import DownloadIcon from "@mui/icons-material/Download";

/**
 * Download Component
 * 
 * A component that encourages users to download the mobile app. It includes a description,
 * a download button, and an image of the mobile app.
 * 
 * @returns {JSX.Element} - Rendered Download component
 */
const Download = () => {
  return (
    <motion.div
      className="flex flex-col lg:flex-row min-h-screen items-center justify-center lg:p-0 lg:space-x-20 p-4 lg:overflow-hidden lg:-mt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Text Content */}
      <motion.div
        className="lg:p-20 w-full lg:w-2/3 dark:text-white text-center lg:text-left"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="font-bold lg:text-5xl text-3xl mb-6">
          For the best experience, download our mobile app!
        </h1>
        <p className="lg:text-2xl text-lg mb-8">
          Enjoy seamless monitoring, real-time energy tracking, and an optimized
          user experience tailored for your device.
          <br />
          Stay in control of your energy usage anytime, anywhere.
        </p>

        {/* Download Button */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:ml-20"
        >
          <Button
            variant="contained"
            className="w-56 text-lg dark:bg-[#3f51b5] dark:hover:bg-[#4963c7]"
            sx={{
              border: "1px solid #ffffff",
            }}
            aria-label="Download Mobile App"
          >
            <DownloadIcon className="mr-2" />
            Download
          </Button>
        </motion.div>
      </motion.div>

      {/* Mobile App Image */}
      <motion.img
        src={"https://res.cloudinary.com/dlfrbjye9/image/upload/v1743398381/tbkxjb4avxltoxssthzq.png"}
        className="w-full lg:w-1/4 mt-10 lg:mt-0 lg:block p-5"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        alt="Mobile App"
        aria-label="Mobile App Preview"
      />
    </motion.div>
  );
};

export default Download;