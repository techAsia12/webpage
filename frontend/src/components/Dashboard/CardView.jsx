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
              {/* Main Value Section */}
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className={`text-3xl lg:text-6xl font-semibold ${color}`}>
                  {value || 0}
                </span>
                <span className="text-3xl lg:text-6xl text-gray-500 dark:text-gray-400">
                  {unit}
                </span>
              </div>
              {/* Header Section */}
              <div className="flex justify-center items-center mb-4">
                <h1 className="text-md lg:text-2xl uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {name}
                </h1>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CardTemp;
