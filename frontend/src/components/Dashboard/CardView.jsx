import { Card, CardContent } from "@mui/material";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CardTemp = ({ color, name, value, unit, totalValue, hidden }) => {
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const options = {
    withCredentials: true,
  };

  const handleSetThreshold = async () => {
    if (!inputValue) {
      toast.error("Please enter a valid threshold value.");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/set-threshold`,
        { threshold: inputValue },
        options
      );
      toast.success("Threshold set successfully!");
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to set threshold. Please try again.");
    }
  };

  return (
    <>
      <Card
        className="w-full lg:w-2/3 shadow-lg rounded-2xl mb-8 p-4"
        role="region"
        aria-label={`Card displaying ${name} value`}
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
          backgroundImage: "none",
        }}
      >
        <CardContent className="!p-0">
          <div className="flex justify-center items-center">
            <div className="w-full">
              {/* Header Section */}
              <div className="flex justify-center items-center mb-4">
                <h1 className="text-lg lg:text-2xl uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {name}
                </h1>
                <FaPlus
                  className={`text-gray-400 cursor-pointer hover:text-gray-600 ${hidden}`}
                  onClick={() => setShowModal(true)}
                  aria-label="Open threshold setting modal"
                  size={16}
                />
              </div>

              {/* Main Value Section */}
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className={`text-5xl lg:text-6xl font-semibold ${color}`}>
                  {value || 0}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {unit}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default CardTemp;
