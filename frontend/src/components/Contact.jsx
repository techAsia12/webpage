import React, { useState } from "react";
import { Button, Card, TextField } from "@mui/material";
import { easeInOut, motion } from "motion/react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const [name, setName] = useState("");
  const [phoneno, setPhonenno] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const mode = useSelector((state) => state.theme.mode);

  const inputStyles = {
    "& .MuiInputLabel-root": {
      color: mode === "dark" ? "white" : "black",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: mode === "dark" ? "white" : "black",
    },
    "& .MuiInputBase-input": {
      color: mode === "dark" ? "white" : "black",
      backgroundColor: "transparent",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: mode === "dark" ? "white" : "black",
    },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: mode === "dark" ? "#BBBBBB" : "#333333",
    },
  };

  const buttonStyles = {
    backgroundColor: mode === "dark" ? "#374151" : "#000000",
    "&:hover": {
      backgroundColor: mode === "dark" ? "#000000" : "#374151",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/send-Mail`,
        {
          name,
          email,
          phoneno,
          message,
        }
      );

      console.log(response);
      toast.success("Email sent successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, please try again!");
    }
  };

  return (
    <div className="w-screen h-fit lg:flex overflow-hidden dark:bg-gray-800 dark:text-white">
      <div className="space-y-6">
        <motion.Card
          className="w-1/4 h-1/3 items-start"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.2}}
        >
          <h1 className="my-10 text-center lg:text-5xl text-2xl">Address</h1>
          <div className="text-center font-thin">
            <p className="my-4 lg:text-xl">
              A-101, Ganpati Krupa Niwas, Opp. NKGSB Bank,Pt. Dindayal Road,
              Dombivli(W), Pin – 421202
            </p>
            <p className="my-4">+91 7666308198</p>
            <a
              href={`mailto:info@techasiamechatronics.com`}
              className="border-b"
            >
              info@techasiamechatronics.com
            </a>
          </div>
        </motion.Card>
        <motion.Card
          className="flex justify-center"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d235.49426307261186!2d73.11453188025294!3d19.19921110789753!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7bf878e333687%3A0xe888f9ff8893f96e!2stechAsia%20Mechatronics%20Private%20Limited!5e0!3m2!1sen!2sin!4v1738911619430!5m2!1sen!2sin"
            className="w-5/6 h-96 border-0 bottom-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.Card>
      </div>

      <motion.div
        className="lg:w-2/3 pl-5 pt-20 h-full text-center"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
      >
        <form
          onSubmit={handleSubmit}
          className="text-center h-full p-10 space-y-4 border-2 dark:border-white border-black rounded-3xl"
        >
          <h1 className="text-3xl">Get In Touch</h1>

          <TextField
            label="Name"
            variant="outlined"
            className={`lg:w-full ${
              mode === "dark" ? "bg-gray-700 text-white border-gray-600" : ""
            }`}
            sx={inputStyles}
            required
            onChange={(e) => setName(e.target.value)}
          />

          <div className="flex space-x-8">
            <TextField
              label="Mobile No"
              variant="outlined"
              className={`lg:w-1/2 ${
                mode === "dark" ? "bg-gray-700 text-white border-gray-600" : ""
              }`}
              sx={inputStyles}
              required
              onChange={(e) => setPhonenno(e.target.value)}
            />
            <TextField
              label="Email"
              variant="outlined"
              multiline
              className={`lg:w-1/2 ${
                mode === "dark" ? "bg-gray-700 text-white border-gray-600" : ""
              }`}
              sx={inputStyles}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <TextField
            label="Message"
            multiline
            rows={6}
            className={`lg:w-full ${
              mode === "dark" ? "bg-gray-700 text-white border-gray-600" : ""
            }`}
            sx={inputStyles}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Button
            variant="contained"
            className="w-44 h-9 text-xl text-white"
            sx={buttonStyles}
            type="submit"
          >
            Send
          </Button>
        </form>
      </motion.div>

      <ToastContainer />
    </div>
  );
};

export default Contact;
