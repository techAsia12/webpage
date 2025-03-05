import React from "react";
import { delay, motion } from "motion/react";
import LooksOneOutlinedIcon from "@mui/icons-material/LooksOneOutlined";
import LooksTwoOutlinedIcon from "@mui/icons-material/LooksTwoOutlined";
import Looks3OutlinedIcon from "@mui/icons-material/Looks3Outlined";

const Working = () => {
  const sectionVariants = (direction) => ({
    hidden: { x: direction === "right" ? 100 : -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 1, ease: "easeInOut" },
    },
  });

  return (
    <div className="border-b border-x-neutral-900 pb-4 lg:mb-35 dark:text-white">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap justify-center text-4xl lg:text-6xl text-black dark:text-white font-thin tracking-tight mb-10"
      >
        How It Works?
      </motion.div>
      <div className="w-full grid-rows-3 mb-10 space-y-20">
        <motion.div
          variants={sectionVariants("right")}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="h-1/2 lg:flex lg:space-x-32"
        >
          <div className="w-full text-center self-center mb-5">
            <LooksOneOutlinedIcon
              sx={{ fontSize: "300%", marginBottom: "20px" }}
            />
            <h1 className="text-3xl lg:text-5xl text-black dark:text-white font-thin tracking-tight mb-5">
              Installation
            </h1>
            <p className="text-2xl lg:text-3xl text-black dark:text-white font-thin tracking-tight">
              Our certified technicians handle the quick and hassle-free
              installation process.
            </p>
          </div>
          <img
            src="https://www.bing.com/th?id=OIP.U_VJuupQohwnzXcKMztqWgHaEo&w=154&h=100&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2"
            className="w-full shadow-lg shadow-black dark:shadow-white rounded-2xl"
          />
        </motion.div>

        <motion.div
          variants={sectionVariants("left")}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="h-1/2 lg:flex lg:space-x-32"
        >
          <div className="w-full text-center self-center mb-5 block lg:hidden">
            <LooksTwoOutlinedIcon
              sx={{ fontSize: "300%", marginBottom: "20px" }}
            />
            <h1 className="text-3xl lg:text-5xl text-black dark:text-white font-thin tracking-tight mb-5">
              Data Transmission
            </h1>
            <p className="text-2xl lg:text-3xl text-black dark:text-white font-thin tracking-tight">
              Securely transmits usage data in real-time to both you and your
              energy provider.
            </p>
          </div>
          <img
            src="https://www.bing.com/th?id=OIP.U_VJuupQohwnzXcKMztqWgHaEo&w=154&h=100&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2"
            className="w-full shadow-lg shadow-black dark:shadow-white rounded-2xl"
          />
          <div className="w-full text-center self-center mb-5 hidden lg:block">
            <LooksTwoOutlinedIcon
              sx={{ fontSize: "300%", marginBottom: "20px" }}
            />
            <h1 className="text-3xl lg:text-5xl text-black dark:text-white font-thin tracking-tight mb-5">
              Data Transmission
            </h1>
            <p className="text-2xl lg:text-3xl text-black dark:text-white font-thin tracking-tight">
              Securely transmits usage data in real-time to both you and your
              energy provider.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={sectionVariants("right")}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="h-1/2 lg:flex lg:space-x-32"
        >
          <div className="w-full text-center self-center mb-5">
            <Looks3OutlinedIcon
              sx={{ fontSize: "300%", marginBottom: "20px" }}
            />
            <h1 className="text-3xl lg:text-5xl text-black dark:text-white font-thin tracking-tight mb-5">
              User Dashboard
            </h1>
            <p className="text-2xl lg:text-3xl text-black dark:text-white font-thin tracking-tight">
              Access detailed insights and reports through our intuitive online
              portal.
            </p>
          </div>
          <img
            src="https://www.bing.com/th?id=OIP.U_VJuupQohwnzXcKMztqWgHaEo&w=154&h=100&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2"
            className="w-full shadow-lg shadow-black dark:shadow-white rounded-2xl"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Working;
