import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { Button, IconButton } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBarAnimation from "../SideBarAnimation.jsx";
import { useSelector } from "react-redux";

const AdminSignup = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [email, setEmail] = useState("");
  const mode = useSelector((state) => state.theme.mode);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !password || !confirm || !phoneno || !email) {
      toast.error("All fields are required.");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/register`,
        {
          name,
          password,
          email,
          phoneno,
          role: "Admin",
        },
        { withCredentials: true }
      );

      if (res?.data?.success === true) {
        toast.success("Registration successful!");
        navigate("/admin/login");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 transition-all">
      <ToastContainer />
      <SideBarAnimation />

      <div className="relative lg:w-3/4 w-4/5 h-fit lg:h-screen border border-neutral-900 rounded-3xl lg:border-none lg:pt-16 backdrop-blur-2xl bg-white/30 dark:bg-gray-800 dark:text-white transition-all">
        <h1 className="text-center text-4xl pt-20">Admin SignUp</h1>
        <form
          onSubmit={handleSubmit}
          className="self-center mx-10 mt-10 space-y-10  flex flex-col justify-center items-center h-3/4"
        >
          <TextField
            label="Enter Name"
            variant="outlined"
            className="lg:w-5/6"
            onChange={(e) => setName(e.target.value)}
            value={name}
            InputLabelProps={{ className: "dark:text-white" }}
            InputProps={{ className: "dark:text-white" }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white", 
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
              "& .MuiInputLabel-root": {
                color: "white", 
              },
            }}
          />
          <TextField
            label="Enter Password"
            type="password"
            variant="outlined"
            className="lg:w-5/6"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            InputLabelProps={{ className: "dark:text-white" }}
            InputProps={{ className: "dark:text-white" }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white", 
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
              "& .MuiInputLabel-root": {
                color: "white", 
              },
            }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            className="lg:w-5/6"
            onChange={(e) => setConfirm(e.target.value)}
            value={confirm}
            InputLabelProps={{ className: "dark:text-white" }}
            InputProps={{ className: "dark:text-white" }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white", 
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
              "& .MuiInputLabel-root": {
                color: "white", 
              },
            }}
          />
          <TextField
            label="Enter Phone Number"
            variant="outlined"
            className="lg:w-5/6"
            onChange={(e) => setPhoneno(e.target.value)}
            value={phoneno}
            InputLabelProps={{ className: "dark:text-white" }}
            InputProps={{ className: "dark:text-white" }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white", 
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
              "& .MuiInputLabel-root": {
                color: "white", 
              },
            }}
          />
          <TextField
            label="Enter E-mail"
            variant="outlined"
            className="lg:w-5/6"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            InputLabelProps={{ className: "dark:text-white" }}
            InputProps={{ className: "dark:text-white" }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white", 
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
              "& .MuiInputLabel-root": {
                color: "white", 
              },
            }}
          />
          <Button
            variant="contained"
            className="w-44 h-9 text-xl text-white"
            sx={{
              backgroundColor: mode === "dark" ? "#374151" : "#000000",
              "&:hover": {
                backgroundColor: mode === "dark" ? "#000000" : "#374151",
              },
            }}
          >
            SignUp
          </Button>
          <Link to={"/"} className="text-sm text-blue-400 text-center">
            Already Have An Account?
          </Link>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
