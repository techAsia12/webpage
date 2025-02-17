import axios from "axios";
import { React, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminAddPhone = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");    const location = useLocation();
    const navigate = useNavigate();
  
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email");
    const name = queryParams.get("name");
  
    const options = { withCredentials: true };
  
    const handleSubmit = async () => {
      setIsLoading(true);
  
      axios
        .post(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/add-phoneno`,
          { email, phone: phoneNumber, name, role:"Admin" },
          options
        )
        .then((res) => {
          toast.success(res.data.message || "Phone number added successfully!", { position: "top-right" });
          
          setTimeout(() => {
            navigate( "/admin/login");
          }, 2000); 
        })
        .catch((error) => {
          const errorMsg = error?.response?.data?.message || "Error adding phone number!";
          toast.error(errorMsg, { position: "top-right" });
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        <ToastContainer />
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Enter Your Phone Number & State
            </h2>
          </div>
  
          <p className="text-gray-600 mb-4">Please enter your phone number & state to continue.</p>
  
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <button
            onClick={handleSubmit}
            disabled={isLoading || !phoneNumber}
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
              isLoading || !phoneNumber
                ? "bg-gray-400"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
  
          <div className="mt-4 text-center text-sm text-gray-500">
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

export default AdminAddPhone