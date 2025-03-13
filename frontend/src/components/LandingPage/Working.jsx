import React from "react";
import { motion } from "framer-motion"; // Corrected import from "framer-motion"
import LooksOneOutlinedIcon from "@mui/icons-material/LooksOneOutlined";
import LooksTwoOutlinedIcon from "@mui/icons-material/LooksTwoOutlined";
import Looks3OutlinedIcon from "@mui/icons-material/Looks3Outlined";

/**
 * Animation variants for sliding sections.
 * 
 * @param {string} direction - Direction of the slide animation ("left" or "right")
 * @returns {Object} - Animation variants
 */
const sectionVariants = (direction) => ({
  hidden: { x: direction === "right" ? 100 : -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 1, ease: "easeInOut" },
  },
});

/**
 * Working Component
 * 
 * A component that explains how the system works, with animated sections.
 * 
 * @returns {JSX.Element} - Rendered Working component
 */
const Working = () => {
  return (
    <section
      className="border-b border-x-neutral-900 pb-4 lg:mb-35 dark:text-white p-5"
      role="region"
      aria-label="How It Works Section"
    >
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap justify-center text-4xl lg:text-6xl text-black dark:text-white font-thin tracking-tight mb-10"
        role="heading"
        aria-level="2"
        aria-label="How It Works"
      >
        How It Works?
      </motion.div>

      {/* Steps Container */}
      <div className="w-full grid-rows-3 mb-10 space-y-20">
        {/* Step 1: Installation */}
        <motion.div
          variants={sectionVariants("right")}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="h-1/2 lg:flex lg:space-x-32"
          role="article"
          aria-label="Installation Step"
        >
          <div className="w-full text-center self-center mb-5">
            <LooksOneOutlinedIcon
              sx={{ fontSize: "300%", marginBottom: "20px" }}
              aria-hidden="true" // Icon is decorative
            />
            <h2 className="text-3xl lg:text-5xl text-black dark:text-white font-thin tracking-tight mb-5">
              Installation
            </h2>
            <p className="text-2xl lg:text-3xl text-black dark:text-white font-thin tracking-tight">
              Our certified technicians handle the quick and hassle-free
              installation process.
            </p>
          </div>
          <img
            src="https://th.bing.com/th/id/OIP.MGbLH7AxvOjZT3njt-tmFAHaEK?w=285&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7"
            className="w-full shadow-lg shadow-black dark:shadow-white rounded-2xl"
            alt="Installation Process"
            aria-label="Installation Process Image"
          />
        </motion.div>

        {/* Step 2: Data Transmission */}
        <motion.div
          variants={sectionVariants("left")}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="h-1/2 lg:flex lg:space-x-32"
          role="article"
          aria-label="Data Transmission Step"
        >
          {/* Mobile View */}
          <div className="w-full text-center self-center mb-5 block lg:hidden">
            <LooksTwoOutlinedIcon
              sx={{ fontSize: "300%", marginBottom: "20px" }}
              aria-hidden="true" // Icon is decorative
            />
            <h2 className="text-3xl lg:text-5xl text-black dark:text-white font-thin tracking-tight mb-5">
              Data Transmission
            </h2>
            <p className="text-2xl lg:text-3xl text-black dark:text-white font-thin tracking-tight">
              Securely transmits usage data in real-time to both you and your
              energy provider.
            </p>
          </div>

          {/* Image */}
          <img
            src="https://th.bing.com/th/id/R.e6e3d7d7dea143fcc21c8acb352d7826?rik=3455fDgrJECZRA&riu=http%3a%2f%2fwww.binarytranslator.com%2fimages%2fdata4.jpg&ehk=QBr7tC8QAzOA%2fuZst3fD6moXx8u7q1hpjbzE6r6HfZg%3d&risl=&pid=ImgRaw&r=0"
            className="w-full shadow-lg shadow-black dark:shadow-white rounded-2xl"
            alt="Data Transmission"
            aria-label="Data Transmission Image"
          />

          {/* Desktop View */}
          <div className="w-full text-center self-center mb-5 hidden lg:block">
            <LooksTwoOutlinedIcon
              sx={{ fontSize: "300%", marginBottom: "20px" }}
              aria-hidden="true" // Icon is decorative
            />
            <h2 className="text-3xl lg:text-5xl text-black dark:text-white font-thin tracking-tight mb-5">
              Data Transmission
            </h2>
            <p className="text-2xl lg:text-3xl text-black dark:text-white font-thin tracking-tight">
              Securely transmits usage data in real-time to both you and your
              energy provider.
            </p>
          </div>
        </motion.div>

        {/* Step 3: User Dashboard */}
        <motion.div
          variants={sectionVariants("right")}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="h-1/2 lg:flex lg:space-x-32"
          role="article"
          aria-label="User Dashboard Step"
        >
          <div className="w-full text-center self-center mb-5">
            <Looks3OutlinedIcon
              sx={{ fontSize: "300%", marginBottom: "20px" }}
              aria-hidden="true" // Icon is decorative
            />
            <h2 className="text-3xl lg:text-5xl text-black dark:text-white font-thin tracking-tight mb-5">
              User Dashboard
            </h2>
            <p className="text-2xl lg:text-3xl text-black dark:text-white font-thin tracking-tight">
              Access detailed insights and reports through our intuitive online
              portal.
            </p>
          </div>
          <img
            src="https://res.cloudinary.com/misbackend/image/upload/v1741687494/qqef6bhkcpgubb5lva8c.png"
            className="w-full lg:w-1/2 shadow-lg shadow-black dark:shadow-white rounded-2xl"
            alt="User Dashboard"
            aria-label="User Dashboard Image"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Working;