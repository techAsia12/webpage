import React, { useState } from "react";
import { Button, Card, TextField } from "@mui/material";
import { motion } from "motion/react"; // Corrected import from "framer-motion"
import { useSelector } from "react-redux";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SendIcon from "@mui/icons-material/Send";

/**
 * Contact Component
 *
 * A contact form component that allows users to send messages. It includes an address card,
 * a Google Maps embed, and a form with fields for name, phone number, email, and message.
 *
 * @returns {JSX.Element} - Rendered Contact component
 */
const Contact = () => {
  const [name, setName] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const mode = useSelector((state) => state.theme.mode);

  // Styles for input fields based on theme
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

  /**
   * Handle form submission.
   *
   * @param {React.FormEvent} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/send-Mail`,
        { name, email, phoneno, message },
        { withCredentials: true }
      );

      console.log(response);
      setName("");
      setPhoneno("");
      setEmail("");
      setMessage("");
      toast.success("Email sent successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, please try again!");
    }
  };

  return (
    <div className="w-screen h-fit lg:flex overflow-hidden px-10 dark:text-white">
      {/* Address and Map Section */}
      <div className="space-y-6">
        {/* Address Card */}
        <motion.Card
          className="w-1/4 h-1/3 items-start"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <h1 className="my-10 text-center lg:text-5xl text-2xl">Address</h1>
          <div className="text-center font-thin">
            <p className="my-4 lg:text-xl px-5">
              A-101, Ganpati Krupa Niwas, Opp. NKGSB Bank, Pt. Dindayal Road,
              Dombivli(W), Pin – 421202
            </p>
            <p className="my-4">+91 7666308198</p>
            <a
              href={`mailto:info@techasiamechatronics.com`}
              className="border-b"
              aria-label="Email Address"
            >
              info@techasiamechatronics.com
            </a>
          </div>
        </motion.Card>

        {/* Google Maps Embed */}
        <motion.Card
          className="flex justify-center"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d235.49426307261186!2d73.11453188025294!3d19.19921110789753!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7bf878e333687%3A0xe888f9ff8893f96e!2stechAsia%20Mechatronics%20Private%20Limited!5e0!3m2!1sen!2sin!4v1738911619430!5m2!1sen!2sin"
            className="w-5/6 lg:h-96 h-1/2 border-0 bottom-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            aria-label="Google Maps Embed"
          ></iframe>
        </motion.Card>
      </div>

      {/* Contact Form Section */}
      <motion.div
        className="lg:w-2/3 pl-5 pt-20 h-full text-center"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
      >
        <form
          onSubmit={handleSubmit}
          className={`text-center p-5 lg:h-full lg:p-10 space-y-4 border-2 rounded-3xl ${
            mode === "dark"
              ? "bg-transparent border-white text-white"
              : "bg-transparent border-black text-black"
          }`}
        >
          <h1 className="text-3xl">Get In Touch</h1>

          {/* Name Field */}
          <TextField
            label="Name"
            variant="outlined"
            className="w-full"
            value={name}
            sx={inputStyles}
            required
            onChange={(e) => setName(e.target.value)}
            aria-label="Name Input"
          />

          {/* Phone Number and Email Fields */}
          <div className="lg:flex space-y-5 lg:space-x-8">
            <TextField
              label="Mobile No"
              variant="outlined"
              className="lg:w-1/2 w-full"
              value={phoneno}
              sx={inputStyles}
              required
              onChange={(e) => setPhoneno(e.target.value)}
              aria-label="Mobile Number Input"
            />
            <TextField
              label="Email"
              variant="outlined"
              value={email}
              className="lg:w-1/2 w-full"
              sx={inputStyles}
              required
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email Input"
            />
          </div>

          {/* Message Field */}
          <TextField
            label="Message"
            multiline
            rows={6}
            className="w-full"
            value={message}
            sx={inputStyles}
            onChange={(e) => setMessage(e.target.value)}
            aria-label="Message Input"
          />

          {/* Submit Button */}
          <Button
            variant="contained"
            className="w-44 h-9 text-xl text-center dark:bg-[#3f51b5] dark:hover:bg-[#4963c7]"
            sx={{
              border: "1px solid white",
            }}
            type="submit"
            aria-label="Submit Button"
          >
            <p className="mt-0.5">Send</p>
            <SendIcon className="ml-2" />
          </Button>
        </form>
      </motion.div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default Contact;
