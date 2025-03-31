import axios from "axios";
import { React, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// SEO Component to add meta tags
const SEO = () => (
  <>
    <title>Add Phone Number | Admin Panel</title>
    <meta
      name="description"
      content="Add your phone number to complete your admin account setup. Enter your phone number to continue."
    />
    <meta
      name="keywords"
      content="admin phone number, admin setup, add phone number"
    />
    <meta name="author" content="TechAsia Mechatronics Pvt Ltd" />
  </>
);

// Phone Number Input Component
const PhoneNumberInput = ({ phoneNumber, setPhoneNumber, isLoading }) => (
  <div className="mb-4">
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
      className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent dark:border-gray-600 dark:text-gray-200"
      disabled={isLoading}
    />
  </div>
);

// Main Component
const AdminAddPhone = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const name = queryParams.get("name");

  const options = { withCredentials: true };

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/add-phoneno`,
        { email, phone: phoneNumber, name, role: "Admin" },
        options
      );

      toast.success(response.data.message || "Phone number added successfully!", {
        position: "top-right",
      });

      setTimeout(() => {
        navigate("/admin/home");
      }, 2000);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || "Error adding phone number!";
      toast.error(errorMsg, { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50 dark:bg-gray-900">
      <SEO /> {/* Add SEO meta tags */}
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Enter Your Phone Number
          </h2>
        </div>

        <p className="text-gray-600 mb-4 dark:text-gray-300">
          Please enter your phone number to continue.
        </p>

        <PhoneNumberInput
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          isLoading={isLoading}
        />

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

export default AdminAddPhone;