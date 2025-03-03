import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [veriferdCode, setVerfiedCode] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirmPassword] = useState("");
  const [label, setLabel] = useState("Forgot password");
  const [desc, setDesc] = useState(
    "Enter your email for the verification process. We will send a 4-digit code to your email."
  );
  const [input, setInput] = useState();
  const [isEmail, setIsEmail] = useState(true);
  const [isCode, setIsCode] = useState(false);
  const [isPassword, setIsPassword] = useState(false);

  const navigate = useNavigate();

  const options = {
    withCredentials: true,
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    const updatedCode = veriferdCode.split("");
    updatedCode[index] = value;
    setVerfiedCode(updatedCode.join(""));

    if (value && index < 3) {
      document.getElementById(`input-${index + 1}`).focus();
    }
    console.log(veriferdCode);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !veriferdCode[index] && index > 0) {
      document.getElementById(`input-${index - 1}`).focus();
    }
  };

  useEffect(() => {
    if (isEmail && !isCode && !isPassword) {
      setLabel("Forgot password");
      setDesc(
        "Enter your email for the verification process. We will send a 4-digit code to your email."
      );
      setInput(
        <>
          <label className="block text-sm font-medium text-gray-700">
            E-mail
          </label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email id"
            className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </>
      );
    } else if (isEmail && isCode && !isPassword) {
      setLabel("Enter 4 digits Code");
      setDesc("Enter the 4-digit code that you received on your email.");
      setInput(
        <div className="flex space-x-2 justify-center mt-8">
          {Array(4)
            .fill(" ")
            .map((_, index) => (
              <input
                key={index}
                id={`input-${index}`}
                type="text"
                value={veriferdCode[index] || ""}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength="1"
                className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
        </div>
      );
    } else if (isEmail && isCode && isPassword) {
      setLabel("Reset password");
      setDesc(
        "Set a new password for your account so you can log in and access all features."
      );
      setInput(
        <>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your new password"
            className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </>
      );
    }
  }, [isEmail, isCode, isPassword, veriferdCode]);

  const handleSubmit = () => {
    setIsLoading(true);

    if (isEmail && !isCode && !isPassword) {
      setIsCode(true);
      axios
        .get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/user/receive-mail?email=${email}`,
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
    } else if (isEmail && isCode && !isPassword) {
      axios
        .post(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/verifyCode`,
          { verificationCode: veriferdCode },
          options
        )
        .then((res) => {
          toast.success("Code Verified Successfully", {
            position: "top-right",
          });
          setRole(res.data.data.role);
          setIsPassword(true);
          setIsLoading(false);
        })
        .catch((error) => {
          toast.error("Invalid Code. Please try again.", {
            position: "top-right",
          });
          setIsLoading(false);
          console.log(error.response);
        });
    } else if (isEmail && isCode && isPassword) {
      if (confirm === password) {
        axios
          .post(
            `${import.meta.env.VITE_BACKEND_URL}/api/user/reset-password`,
            {
              email,
              password,
            },
            options
          )
          .then((res) => {
            if (res.status === 200) {
              toast.success("Password reset successfully!", {
                position: "top-right",
              });
              if (role == "Client") {
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
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{label}</h2>
        </div>

        <p className="text-gray-600 mb-4">{desc}</p>

        <div className="mb-4">{input}</div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || !email}
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
            isLoading || !email
              ? "bg-gray-400"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          ) : (
            "Submit"
          )}
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

export default ForgotPassword;
