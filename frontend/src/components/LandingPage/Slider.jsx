import React, { useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { motion } from "motion/react";

const Slider = () => {
  const slides = [
    {
      url: "https://res.cloudinary.com/misbackend/image/upload/v1741692864/Untitled_design_4_nygefr.png",
      title: "Real-Time Monitoring",
      textLists:
        "Track your energy consumption instantly, allowing for informed decisions and energy savings.",
    },
    {
      url: "https://res.cloudinary.com/misbackend/image/upload/v1741692985/Untitled_design_5_rf9a6k.png",
      title: "Accurate Billing",
      textLists:
        "Eliminate estimated bills with precise measurements, ensuring you only pay for what you use.",
    },
    {
      url: "https://res.cloudinary.com/misbackend/image/upload/v1741692522/Untitled_design_jzgywl.png",
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

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
      className="relative mb-10"
    >
      <div
        className="w-full h-96 bg-cover bg-center rounded-2xl shadow-lg shadow-black dark:shadow-white"
        style={{
          backgroundImage: `url(${slides[currentIndex].url})`,
        }}
      >
        <div className="absolute top-5 lg:left-10 left-4 text-white lg:text-4xl text-3xl font-thin tracking-tight">
          {slides[currentIndex].title}
        </div>
        <div className="absolute  lg:w-96 bottom-8 lg:right-10 lg:mr-10 ml-5 text-white text-xl lg:text-3xl font-thin tracking-tight">
          {slides[currentIndex].textLists}
        </div>

        <div className="absolute top-[50%] left-4 transform -translate-y-1/2 z-10 cursor-pointer text-white">
          <ArrowBackIosNewIcon
            sx={{ width: "25px", height: "25px" }}
            onClick={prevSlide}
          />
        </div>

        <div className="absolute lg:top-[44%] top-[46%] right-4  z-10 cursor-pointer text-white">
          <ArrowForwardIosIcon
            sx={{ width: "25px", height: "25px" }}
            onClick={nextSlide}
          />
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              currentIndex === index ? "bg-white" : "bg-gray-500"
            } transition-all`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Slider;
