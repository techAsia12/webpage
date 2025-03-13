import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * ForgotPassword Component
 * 
 * A multi-step form for resetting a user's password. It includes email verification,
 * code verification, and password reset functionality.
 * 
 * @returns {JSX.Element} - Rendered ForgotPassword component
 */
const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [label, setLabel] = useState("Forgot password");
  const [description, setDescription] = useState(
    "Enter your email for the verification process. We will send a 4-digit code to your email."
  );
  const [input, setInput] = useState();
  const [isEmailStep, setIsEmailStep] = useState(true);
  const [isCodeStep, setIsCodeStep] = useState(false);
  const [isPasswordStep, setIsPasswordStep] = useState(false);

  const navigate = useNavigate();

  const options = {
    withCredentials: true,
  };

  /**
   * Handles input changes for the verification code.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event
   * @param {number} index - The index of the input field
   */
  const handleCodeChange = (e, index) => {
    const value = e.target.value;
    const updatedCode = verificationCode.split("");
    updatedCode[index] = value;
    setVerificationCode(updatedCode.join(""));

    if (value && index < 3) {
      document.getElementById(`input-${index + 1}`).focus();
    }
  };

  /**
   * Handles backspace key press for the verification code inputs.
   * 
   * @param {React.KeyboardEvent<HTMLInputElement>} e - The keyboard event
   * @param {number} index - The index of the input field
   */
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      document.getElementById(`input-${index - 1}`).focus();
    }
  };

  // Update the form UI based on the current step
  useEffect(() => {
    if (isEmailStep && !isCodeStep && !isPasswordStep) {
      setLabel("Forgot password");
      setDescription(
        "Enter your email for the verification process. We will send a 4-digit code to your email."
      );
      setInput(
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            E-mail
          </label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email id"
            className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            aria-label="Email Input"
          />
        </>
      );
    } else if (isEmailStep && isCodeStep && !isPasswordStep) {
      setLabel("Enter 4 digits Code");
      setDescription("Enter the 4-digit code that you received on your email.");
      setInput(
        <div className="flex space-x-2 justify-center mt-8">
          {Array(4)
            .fill(" ")
            .map((_, index) => (
              <input
                key={index}
                id={`input-${index}`}
                type="text"
                value={verificationCode[index] || ""}
                onChange={(e) => handleCodeChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength="1"
                className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                aria-label={`Verification Code Input ${index + 1}`}
              />
            ))}
        </div>
      );
    } else if (isEmailStep && isCodeStep && isPasswordStep) {
      setLabel("Reset password");
      setDescription(
        "Set a new password for your account so you can log in and access all features."
      );
      setInput(
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your new password"
            className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            aria-label="Password Input"
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirm Password
          </label>
          <input
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            aria-label="Confirm Password Input"
          />
        </>
      );
    }
  }, [isEmailStep, isCodeStep, isPasswordStep, verificationCode]);

  /**
   * Handles form submission based on the current step.
   */
  const handleSubmit = () => {
    setIsLoading(true);

    if (isEmailStep && !isCodeStep && !isPasswordStep) {
      // Step 1: Send verification code
      setIsCodeStep(true);
      axios
        .get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/receive-mail?email=${email}`,
          options
        )
        .then((res) => {
          toast.success("Verification code sent to your email!", {
            position: "top-right",
          });
          setIsLoading(false);
        })
        .catch((error) => {
          toast.error("Failed to send verification code. Please try again.", {
            position: "top-right",
          });
          console.log(error.response);
        });
    } else if (isEmailStep && isCodeStep && !isPasswordStep) {
      // Step 2: Verify code
      axios
        .post(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/verifyCode`,
          { verificationCode },
          options
        )
        .then((res) => {
          toast.success("Code Verified Successfully", {
            position: "top-right",
          });
          setRole(res.data.data.role);
          setIsPasswordStep(true);
          setIsLoading(false);
        })
        .catch((error) => {
          toast.error("Invalid Code. Please try again.", {
            position: "top-right",
          });
          setIsLoading(false);
          console.log(error.response);
        });
    } else if (isEmailStep && isCodeStep && isPasswordStep) {
      // Step 3: Reset password
      if (confirmPassword === password) {
        axios
          .post(
            `${import.meta.env.VITE_BACKEND_URL}/api/user/reset-password`,
            { email, password },
            options
          )
          .then((res) => {
            if (res.status === 200) {
              toast.success("Password reset successfully!", {
                position: "top-right",
              });
              if (role === "Client") {
                navigate("/");
              } else {
                navigate("/admin/login");
              }
            }
          })
          .catch((error) => {
            toast.error("Failed to reset password. Please try again.", {
              position: "top-right",
            });
            console.log(error.response.data);
          });
        setIsLoading(false);
      } else {
        toast.error("Passwords do not match. Please check and try again.", {
          position: "top-right",
        });
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50 dark:bg-gray-900 dark:bg-opacity-50"
      role="dialog"
      aria-label="Forgot Password Form"
    >
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 dark:bg-gray-800">
        {/* Form Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {label}
          </h2>
        </div>

        {/* Form Description */}
        <p className="text-gray-600 mb-4 dark:text-gray-400">{description}</p>

        {/* Dynamic Input Fields */}
        <div className="mb-4">{input}</div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || !email}
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
            isLoading || !email
              ? "bg-gray-400"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          aria-label="Submit Button"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
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

export default ForgotPassword;