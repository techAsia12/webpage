import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBarAnimation from "../SideBarAnimation.jsx";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { login } from "../../Features/auth/auth.slice.js";
import LogoutIcon from "@mui/icons-material/Logout";

// SEO Component to add meta tags
const SEO = () => (
  <>
    <title>Admin Signup | SmartEnergyMeter</title>
    <meta
      name="description"
      content="Sign up as an admin to manage your account. Enter your name, email, phone number, and password to get started."
    />
    <meta
      name="keywords"
      content="admin signup, admin registration, create admin account"
    />
    <meta name="author" content="Your Company Name" />
  </>
);

// Form Input Component
const FormInput = ({ label, type, value, onChange, mode }) => (
  <TextField
    label={label}
    type={type}
    variant="outlined"
    className="lg:w-5/6"
    value={value}
    onChange={onChange}
    sx={{
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: mode === "dark" ? "white" : "black",
        },
        "&:hover fieldset": {
          borderColor: mode === "dark" ? "white" : "black",
        },
        "&.Mui-focused fieldset": {
          borderColor: mode === "dark" ? "white" : "black",
        },
      },
      "& .MuiInputLabel-root": {
        color: mode === "dark" ? "white" : "black",
      },
    }}
  />
);

// Main Component
const AdminSignup = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const mode = useSelector((state) => state.theme.mode);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const options = { withCredentials: true };

  // Handle form submission
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

  // Handle Google login success
  const handleGoogleLoginSuccess = (credentialResponse) => {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      toast.error("No token received", { position: "top-right" });
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/google-login`,
        { token: idToken },
        options
      )
      .then((response) => {
        toast.success("Google login successful!", {
          position: "top-right",
        });
        setTimeout(() => {
          if (response?.status === 201) {
            navigate(
              `/admin/add-phone?email=${response.data.data.email}&name=${response.data.data.name}`
            );
          } else if (response?.status === 200) {
            dispatch(login(response.data.data));
            navigate(`/admin/home`);
          }
        }, 2000);
      })
      .catch((error) => {
        toast.error("Google login failed!", {
          position: "top-right",
        });
      });
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center transition-all bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,0,0,0.2),rgba(0,0,0,0))] dark:bg-neutral-950 dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:text-white selection:bg-gray-400 selection:text-gray-800">
      <SEO /> {/* Add SEO meta tags */}
      <ToastContainer />
      <SideBarAnimation />
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50">
          <CircularProgress
            size={80}
            color="inherit"
            className="dark:text-white"
          />
        </div>
      )}
      <LogoutIcon
        className="fixed top-10 right-10 z-50 cursor-pointer"
        onClick={() => navigate("/")}
      />
      <div
        className={`lg:w-3/4 w-4/5 h-fit lg:h-screen border rounded-3xl lg:border-none lg:pt-16 backdrop-blur-2xl `}
      >
        <h1 className="text-center text-4xl pt-20 tracking-tighter">
          Admin SignUp
        </h1>
        <form
          onSubmit={handleSubmit}
          className="self-center mx-10 mt-10 space-y-5 flex flex-col justify-center items-center h-3/4"
        >
          <FormInput
            label="Enter Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            mode={mode}
          />
          <FormInput
            label="Enter Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            mode={mode}
          />
          <FormInput
            label="Confirm Password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            mode={mode}
          />
          <FormInput
            label="Enter Phone Number"
            type="text"
            value={phoneno}
            onChange={(e) => setPhoneno(e.target.value)}
            mode={mode}
          />
          <FormInput
            label="Enter E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            mode={mode}
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

          <p className="text-center">OR</p>

          <GoogleLogin
            size="medium"
            onSuccess={handleGoogleLoginSuccess}
            onError={() => {
              toast.error("Google Login Failed", { position: "top-right" });
            }}
          />

          <p className="text-center text-xs lg:text-base">
            Already Have An Account?
            <Link
              to={"/login"}
              className="text-sm text-blue-400 underline text-center"
            >
              SignIn
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
