import axios from "axios";
import { React, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useSelector } from "react-redux";

/**
 * Addphone Component
 * 
 * A form component for users to add their phone number and select their state and service provider.
 * It includes validation, loading states, and error handling.
 * 
 * @returns {JSX.Element} - Rendered Addphone component
 */
const Addphone = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedServiceProvider, setSelectedServiceProvider] = useState("");
  const [states, setStates] = useState([]);
  const mode = useSelector((state) => state.theme.mode);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract query parameters from the URL
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const name = queryParams.get("name");

  const options = { withCredentials: true };

  // Fetch states data on component mount
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/retrive-stateDets`)
      .then((res) => setStates(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  // Handle state selection change
  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setSelectedServiceProvider("");
  };

  // Helper functions to extract state and service provider names
  const getStateName = (stateString) => stateString.split("_")[1];
  const getServiceProvider = (stateString) => stateString.split("_")[0];
  const uniqueStates = Array.from(
    new Set(states.map((s) => getStateName(s.state)))
  );

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true);

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/add-phoneno`,
        { email, phone: phoneNumber, name, state: selectedServiceProvider, role: "Client" },
        options
      )
      .then((res) => {
        toast.success(res.data.message || "Phone number added successfully!", {
          position: "top-right",
        });

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((error) => {
        const errorMsg =
          error?.response?.data?.message || "Error adding phone number!";
        toast.error(errorMsg, { position: "top-right" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50 dark:bg-gray-900"
      role="dialog"
      aria-label="Add Phone Number Form"
    >
      <ToastContainer />
      {isLoading && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50"
          role="alert"
          aria-label="Loading"
        >
          <ElectricBoltIcon className="z-50 transform translate-x-14" />
          <CircularProgress size={80} color="inherit" />
        </div>
      )}
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 dark:bg-gray-800">
        {/* Form Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Enter Your Phone Number & State
          </h2>
        </div>

        {/* Form Description */}
        <p className="text-gray-600 mb-4 dark:text-gray-300">
          Please enter your phone number & state to continue.
        </p>

        {/* Phone Number Input */}
        <div className="mb-5">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
            className="mt-2 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent dark:border-gray-600 dark:text-gray-200"
            aria-label="Phone Number Input"
          />
        </div>

        {/* State Selection Dropdown */}
        <FormControl className="w-full">
          <InputLabel className="dark:text-white">State</InputLabel>
          <Select
            value={selectedState}
            onChange={handleStateChange}
            className="mb-5"
            disabled={isLoading}
            sx={{
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
              "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: mode === "dark" ? "#BBBBBB" : "#333333",
                },
            }}
            aria-label="State Selection"
          >
            {uniqueStates.map((stateName) => (
              <MenuItem key={stateName} value={stateName}>
                {stateName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Service Provider Selection Dropdown */}
        <FormControl
          className="w-full"
          disabled={!selectedState || isLoading}
        >
          <InputLabel className="dark:text-white">Service Provider</InputLabel>
          <Select
            value={selectedServiceProvider}
            onChange={(e) => setSelectedServiceProvider(e.target.value)}
            sx={{
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
              "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: mode === "dark" ? "#BBBBBB" : "#333333",
                },
            }}
            aria-label="Service Provider Selection"
          >
            {states
              .filter((s) => getStateName(s.state) === selectedState)
              .map((s) => (
                <MenuItem key={s.state} value={s.state}>
                  {getServiceProvider(s.state)}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || !phoneNumber}
          className={`mt-10 w-full py-2 px-4 rounded-lg text-white font-semibold ${
            isLoading || !phoneNumber
              ? "bg-gray-400"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          aria-label="Submit Button"
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Submit"
          )}
        </button>

        {/* Terms and Conditions */}
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            By submitting, you agree to our{" "}
            <a href="#" className="text-blue-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-500">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Addphone;