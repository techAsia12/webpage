import React from "react";
import { Card, duration } from "@mui/material";
import { delay, motion } from "motion/react";

const Contact = () => {
  const center = {
    lat: 48.8584,
    lng: 2.2945,
  };

  const containerStyle = {
    width: "100%",
    height: "500px",
  };

  return (
    <div className="w-screen h-screen space-y-10 overflow-hidden dark:bg-gray-800 dark:text-white">
      <motion.Card
        className="w-1/4 h-1/3 items-start"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <h1 className="my-10 text-center lg:text-5xl text-2xl">Address</h1>
        <div className="text-center font-thin">
          <p className="my-4 lg:text-xl">  
            A-101, Ganpati Krupa Niwas, Opp. NKGSB Bank,Pt. Dindayal Road,
            Dombivli(W), Pin – 421202
          </p>
          <p className="my-4">+91 7666308198</p>
          <a href={`mailto:info@techasiamechatronics.com`} className="border-b">
            info@techasiamechatronics.com
          </a>
        </div>
      </motion.Card>
      <motion.Card
        className="flex justify-center h-full"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d235.49426307261186!2d73.11453188025294!3d19.19921110789753!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7bf878e333687%3A0xe888f9ff8893f96e!2stechAsia%20Mechatronics%20Private%20Limited!5e0!3m2!1sen!2sin!4v1738911619430!5m2!1sen!2sin"
          class="w-5/6 h-96 border-0 bottom-0"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </motion.Card>
    </div>
  );
};

export default Contact;
