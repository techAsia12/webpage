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
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !password || !confirm || !phoneno || !email) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match.");
      setLoading(false);
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
      setLoading(false);
      if (res?.data?.success === true) {
        toast.success("Registration successful!");
        navigate("/admin/login");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center transition-all bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,0,0,0.2),rgba(0,0,0,0))] dark:bg-neutral-950 dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:text-white selection:bg-gray-400 selection:text-gray-800">
      <ToastContainer />
      <SideBarAnimation />

      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50">
          <ElectricBoltIcon className="z-50 transform translate-x-14 dark:text-white" />
          <CircularProgress
            size={80}
            color="inherit"
            className="dark:text-white"
          />
        </div>
      )}

      <div
        className={`lg:w-3/4 w-4/5 h-fit lg:h-screen border rounded-3xl lg:border-none lg:pt-16 backdrop-blur-2xl `}
      >
        <h1 className="text-center text-4xl pt-20 tracking-tighter">
          Admin SignUp
        </h1>
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
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: mode==="dark"?"white":"black",
                },
                "&:hover fieldset": {
                  borderColor: mode==="dark"?"white":"black",
                },
                "&.Mui-focused fieldset": {
                  borderColor: mode==="dark"?"white":"black",
                },
              },
              "& .MuiInputLabel-root": {
                color: mode==="dark"?"white":"black",
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
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: mode==="dark"?"white":"black",
                },
                "&:hover fieldset": {
                  borderColor: mode==="dark"?"white":"black",
                },
                "&.Mui-focused fieldset": {
                  borderColor: mode==="dark"?"white":"black",
                },
              },
              "& .MuiInputLabel-root": {
                color: mode==="dark"?"white":"black",
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
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: mode==="dark"?"white":"black",
                },
                "&:hover fieldset": {
                  borderColor: mode==="dark"?"white":"black",
                },
                "&.Mui-focused fieldset": {
                  borderColor: mode==="dark"?"white":"black",
                },
              },
              "& .MuiInputLabel-root": {
                color: mode==="dark"?"white":"black",
              },
            }}
          />
          <TextField
            label="Enter Phone Number"
            variant="outlined"
            className="lg:w-5/6"
            onChange={(e) => setPhoneno(e.target.value)}
            value={phoneno}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: mode==="dark"?"white":"black",
                },
                "&:hover fieldset": {
                  borderColor: mode==="dark"?"white":"black",
                },
                "&.Mui-focused fieldset": {
                  borderColor: mode==="dark"?"white":"black",
                },
              },
              "& .MuiInputLabel-root": {
                color: mode==="dark"?"white":"black",
              },
            }}
          />
          <TextField
            label="Enter E-mail"
            variant="outlined"
            className="lg:w-5/6"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: mode==="dark"?"white":"black",
                },
                "&:hover fieldset": {
                  borderColor:mode==="dark"? "white":"black",
                },
                "&.Mui-focused fieldset": {
                  borderColor: mode==="dark"?"white":"black",
                },
              },
              "& .MuiInputLabel-root": {
                color:mode==="dark"?"white":"black",
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
              border: "1px solid #ffffff",
            }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Signup"}
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
