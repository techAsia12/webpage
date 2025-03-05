import React from "react";
import { motion } from "motion/react";
import EmailIcon from "@mui/icons-material/Email";

const Footer = () => {
  return (
    <div className="border-b border-neutral-900 pb-20 dark:text-white">
      <motion.h1
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5 }}
        className="my-10 text-center text-4xl"
      >
        Contact{" "}
      </motion.h1>
      <div className="text-center tracking-tighter">
        <motion.p
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="my-4"
        >
          {" "}
          A-101, Ganpati Krupa Niwas, Opp. NKGSB Bank,Pt. Dindayal Road,
          Dombivli(W), Pin – 421202
        </motion.p>
        <motion.p
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.5 }}
          className="my-4"
        >
          +91 7666308198
        </motion.p>

        <a href={`mailto:info@techasiamechatronics.com`} className="border-b">
          <EmailIcon /> info@techasiamechatronics.com
        </a>
      </div>
      
    </div>
  );
};

export default Footer;
