import { Card, CardContent } from "@mui/material";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * CardTemp Component
 * 
 * A card component that displays a value with a name and unit, and allows setting a threshold.
 * It includes a modal for inputting the threshold value and uses toast notifications for feedback.
 * 
 * @param {Object} props - Component props
 * @param {string} props.color - Color class for the value text
 * @param {string} props.name - Name of the value being displayed
 * @param {number} props.value - The value to be displayed
 * @param {string} props.unit - Unit of the value
 * @param {string} props.hidden - Class to conditionally hide the plus icon
 * @returns {JSX.Element} - Rendered CardTemp component
 */
const CardTemp = ({ color, name, value, unit, hidden }) => {
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const options = {
    withCredentials: true,
  };

  /**
   * Handles setting the threshold by making a POST request to the backend.
   * Displays a toast notification based on the result.
   */
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

  /**
   * Handles input change in the threshold input field.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event
   */
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      <Card 
        className="sm:w-4/5 lg:w-full shadow-lg rounded-full mb-8 pr-1 bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,0,0,0.2),rgba(0,0,0,0))] dark:bg-neutral-950 dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] border"
        role="region"
        aria-label={`Card displaying ${name} value`}
      >
        <CardContent>
          <div className="flex justify-between items-center">
            <h1 className="lg:text-3xl text-xl text-neutral-400 w-full">
              {name}
            </h1>
            <FaPlus
              className={`text-neutral-400 cursor-pointer hover:text-neutral-600 ${hidden}`}
              onClick={() => setShowModal(true)}
              aria-label="Open threshold setting modal"
            />
          </div>
          <p className={`ml-14 lg:text-6xl text-2xl ${color}`}>
            {'₹'} {value || 0}
          </p>
        </CardContent>
      </Card>

      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10"
          role="dialog"
          aria-label="Threshold setting modal"
        >
          <div className="bg-white p-6 rounded-lg dark:bg-gray-900 dark:text-white">
            <h2 className="text-lg font-bold mb-4">Set Threshold</h2>
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              className="border p-2 w-full mb-4 bg-transparent dark:text-white"
              placeholder="Enter threshold value"
              aria-label="Threshold input"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="mr-2 px-4 py-2 bg-gray-300 rounded dark:bg-gray-800 border"
                aria-label="Cancel threshold setting"
              >
                Cancel
              </button>
              <button
                onClick={handleSetThreshold}
                className="px-4 py-2 bg-blue-500 text-white rounded dark:bg-gray-800 border"
                aria-label="Set threshold"
              >
                Set
              </button>
            </div>
          </div>
        </div>
      )}

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