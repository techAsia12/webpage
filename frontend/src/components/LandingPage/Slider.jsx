import React, { useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { motion } from "framer-motion"; // Corrected import from "framer-motion"

/**
 * Slider Component
 * 
 * A slider component that displays a series of slides with navigation controls.
 * It supports keyboard navigation and is optimized for accessibility.
 * 
 * @returns {JSX.Element} - Rendered Slider component
 */
const Slider = () => {
  // Slide data
  const slides = [
    {
      url: "https://res.cloudinary.com/dlfrbjye9/image/upload/v1743399377/kyvniyo8sqs4otiflzct.png",
      title: "Real-Time Monitoring",
      textLists:
        "Track your energy consumption instantly, allowing for informed decisions and energy savings.",
    },
    {
      url: "https://vergiler.az/media/2019/11/05/e-qaime_yeni.jpg",
      title: "Accurate Billing",
      textLists:
        "Eliminate estimated bills with precise measurements, ensuring you only pay for what you use.",
    },
    {
      url: "https://astecit.com/wp-content/uploads/2021/03/cloud-phone-system.jpg",
      title: "Remote Access",
      textLists:
        "Monitor and manage your energy usage from anywhere with our user-friendly mobile app.",
    },
    {
      url: "https://i.pinimg.com/736x/87/4f/da/874fda66dfaed0f70482d2f4e209b5d0.jpg",
      title: "Smart Alerts & Notifications",
      textLists:
        "Receive instant alerts for unusual energy spikes, faults, or maintenance needs to stay in control.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Navigate to the next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Navigate to the previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  // Navigate to a specific slide
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
      className="relative mb-10"
      role="region"
      aria-label="Image Slider"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Slide Container */}
      <div
        className="w-full h-96 bg-cover bg-center rounded-2xl shadow-lg shadow-black dark:shadow-white"
        style={{
          backgroundImage: `url(${slides[currentIndex].url})`,
        }}
        role="img"
        aria-label={slides[currentIndex].title}
      >
        {/* Slide Title */}
        <div className="absolute top-5 lg:left-10 left-4 text-white lg:text-4xl text-3xl font-thin tracking-tight">
          {slides[currentIndex].title}
        </div>

        {/* Slide Description */}
        <div className="absolute lg:w-96 bottom-8 lg:right-10 lg:mr-10 ml-5 text-white text-xl lg:text-3xl font-thin tracking-tight">
          {slides[currentIndex].textLists}
        </div>

        {/* Previous Slide Button */}
        <div
          className="absolute top-[50%] left-4 transform -translate-y-1/2 z-10 cursor-pointer text-white"
          role="button"
          aria-label="Previous Slide"
          onClick={prevSlide}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") prevSlide();
          }}
        >
          <ArrowBackIosNewIcon sx={{ width: "25px", height: "25px" }} />
        </div>

        {/* Next Slide Button */}
        <div
          className="absolute lg:top-[44%] top-[46%] right-4 z-10 cursor-pointer text-white"
          role="button"
          aria-label="Next Slide"
          onClick={nextSlide}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") nextSlide();
          }}
        >
          <ArrowForwardIosIcon sx={{ width: "25px", height: "25px" }} />
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              currentIndex === index ? "bg-white" : "bg-gray-500"
            } transition-all`}
            role="button"
            aria-label={`Go to slide ${index + 1}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") goToSlide(index);
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Slider;