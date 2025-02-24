import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import TextField from "@mui/material/TextField";
import {
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBarAnimation from "./SideBarAnimation";

const Signup = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [email, setEmail] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedServiceProvider, setSelectedServiceProvider] = useState("");
  const [states, setStates] = useState([]);
  const navigate = useNavigate();

  const options = {
    withCredentials: true,
  };

  const handleStateChange = (event) => {
    const state = event.target.value;
    setSelectedState(state);
    setSelectedServiceProvider(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !name ||
      !password ||
      !confirm ||
      !phoneno ||
      !email ||
      !selectedServiceProvider
    ) {
      toast.error("All fields are required.");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match.");
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
        options
      );

      if (res?.data?.success === true) {
        toast.success("Registration successful!");
        navigate("/");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred.");
    }
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/retrive-stateDets`)
      .then((res) => {
        setStates(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const getStateName = (stateString) => {
    return stateString.split("_")[1];
  };

  const getServiceProvider = (stateString) => {
    return stateString.split("_")[0]; 
  };

  const uniqueStates = Array.from(new Set(states.map(stateObj => getStateName(stateObj.state))));

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-slate-200 ">
      <ToastContainer />
      <SideBarAnimation />
      <div className="lg:w-3/4 w-4/5 h-fit lg:h-screen border border-neutral-900 rounded-3xl lg:border-none lg:pt-16 backdrop-blur-2xl bg-white/30">
        <h1 className="text-center text-4xl pt-12">Client SignUp</h1>
        <form
          onSubmit={handleSubmit}
          className="self-center mx-10 mt-10 space-y-4 flex flex-col justify-center items-center h-3/4 "
        >
          <TextField
            label="Enter Name"
            variant="outlined"
            className="lg:w-5/6"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <TextField
            label="Enter Password"
            type="password"
            variant="outlined"
            className="lg:w-5/6"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            className="lg:w-5/6"
            onChange={(e) => setConfirm(e.target.value)}
            value={confirm}
          />
          <TextField
            label="Enter Phone Number"
            variant="outlined"
            className="lg:w-5/6"
            onChange={(e) => setPhoneno(e.target.value)}
            value={phoneno}
          />
          <TextField
            label="Enter E-mail"
            variant="outlined"
            className="lg:w-5/6"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />

          <FormControl className="lg:w-5/6 w-full" margin="normal">
            <InputLabel>State</InputLabel>
            <Select
              label="State"
              value={selectedState}
              onChange={handleStateChange}
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
            margin="normal"
            disabled={!selectedState} 
          >
            <InputLabel>Service Provider</InputLabel>
            <Select
              label="Service Provider"
              value={selectedServiceProvider}
              onChange={(e) => setSelectedServiceProvider(e.target.value)}
            >
              {states
                .filter((stateObj) => getStateName(stateObj.state) === selectedState)
                .map((stateObj) => (
                  <MenuItem key={stateObj.state} value={stateObj.state}>
                    {getServiceProvider(stateObj.state)}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            type="submit"
            className="border border-neutral-900 w-44 h-9 text-xl"
          >
            Signup
          </Button>
          <Link to={"/"} className="text-sm text-blue-400 text-center">
            Already Have An Account?
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Signup;
