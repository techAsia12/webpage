import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import {
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBarAnimation from "../components/SideBarAnimation.jsx";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import { Helmet } from "react-helmet";

const Signup = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [email, setEmail] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedServiceProvider, setSelectedServiceProvider] = useState("");
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const mode = useSelector((state) => state.theme.mode);

  // Handle state change
  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setSelectedServiceProvider("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form fields
    if (
      !name ||
      !password ||
      !confirm ||
      !phoneno ||
      !email ||
      !selectedServiceProvider
    ) {
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
        `${import.meta.env.VITE_BACKEND_URL}/api/user/register`,
        {
          name,
          password,
          email,
          phoneno,
          state: selectedState,
          serviceProvider: selectedServiceProvider,
          role: "Client",
        },
        { withCredentials: true }
      );

      setLoading(false);
      if (res?.data?.success) {
        toast.success("Registration successful!");
        navigate("/");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message || "An error occurred.");
    }
  };

  // Fetch states on component mount
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/retrive-stateDets`)
      .then((res) => setStates(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  // Helper functions to extract state and service provider names
  const getStateName = (stateString) => stateString.split("_")[1];
  const getServiceProvider = (stateString) => stateString.split("_")[0];
  const uniqueStates = Array.from(
    new Set(states.map((s) => getStateName(s.state)))
  );

  return (
    <div
      className={`w-screen h-screen flex justify-center items-center bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,0,0,0.2),rgba(0,0,0,0))] dark:bg-neutral-950 dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:text-white selection:bg-gray-400 selection:text-gray-800`}
    >
      <Helmet>
        <title>Sign Up - Your App Name</title>
        <meta
          name="description"
          content="Sign up for an account on Your App Name. Register as a client and start managing your services."
        />
        <meta name="keywords" content="sign up, register, client, your app name" />
      </Helmet>

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
        <h1 className="text-center text-4xl pt-12 tracking-tighter">
          Client SignUp
        </h1>
        <form
          onSubmit={handleSubmit}
          className="mx-10 mt-10 space-y-4 flex flex-col justify-center items-center h-3/4"
        >
          <TextField
            label="Enter Name"
            variant="outlined"
            className="lg:w-5/6"
            onChange={(e) => setName(e.target.value)}
            value={name}
            disabled={loading}
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
          />
          <TextField
            label="Enter Password"
            type="password"
            variant="outlined"
            className="lg:w-5/6"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            disabled={loading}
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
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            className="lg:w-5/6"
            onChange={(e) => setConfirm(e.target.value)}
            value={confirm}
            disabled={loading}
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
          />
          <TextField
            label="Enter Phone Number"
            variant="outlined"
            className="lg:w-5/6"
            onChange={(e) => setPhoneno(e.target.value)}
            value={phoneno}
            disabled={loading}
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
          />
          <TextField
            label="Enter E-mail"
            variant="outlined"
            className="lg:w-5/6"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            disabled={loading}
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
          />

          <FormControl className="lg:w-5/6 w-full">
            <InputLabel className="dark:text-white">State</InputLabel>
            <Select
              value={selectedState}
              onChange={handleStateChange}
              disabled={loading}
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
            >
              {uniqueStates.map((stateName) => (
                <MenuItem key={stateName} value={stateName}>
                  {stateName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            className="lg:w-5/6 w-full"
            disabled={!selectedState || loading}
          >
            <InputLabel className="dark:text-white">
              Service Provider
            </InputLabel>
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

          <Button
            variant="contained"
            type="submit"
            className="w-44 h-9 text-xl"
            sx={{ border: "1px solid #ffffff" }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Signup"}
          </Button>
          <p>
            Already Have An Account{" "}
            <Link
              to="/login"
              className="text-blue-400 text-center hover:underline"
            >
              Sign In?
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;