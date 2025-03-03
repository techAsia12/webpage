import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import {
  TextField,
  IconButton,
  InputAdornment,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../Features/auth/auth.slice";
import SideBarAnimation from "../SideBarAnimation";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Client");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const options = { withCredentials: true };
  const mode = useSelector((state) => state.theme.mode);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleRoleChange = (event, newRole) => {
    if (newRole) {
      setRole(newRole);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let url;
    role === "Admin"
      ? (url = `${import.meta.env.VITE_BACKEND_URL}/api/admin/login`)
      : (url = `${import.meta.env.VITE_BACKEND_URL}/api/user/login`);

    axios
      .post(`${url}`, { email, password, role }, options)
      .then((res) => {
        setLoading(false);
        if (res?.data?.success === true) {
          toast.success(res.data.message || "Login successful!", {
            position: "top-right",
          });
          const user = res.data.data;
          setTimeout(() => {
            dispatch(login(user));
            navigate("/dashboard");
          }, 2000);
        }
      })
      .catch((error) => {
        setLoading(false);
        const errorMsg = error?.response?.data?.message || "Login failed!";
        toast.error(errorMsg, { position: "top-right" });
      });
  };

  return (
    <div
      className={`w-screen h-screen flex justify-center items-center lg:flex-none bg-slate-200 dark:bg-gray-900`}
    >
      <ToastContainer />
      <SideBarAnimation />

      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-40">
          <ElectricBoltIcon className="z-50 transform translate-x-14 dark:text-white" />
          <CircularProgress
            size={80}
            color="inherit"
            className="dark:text-white"
          />
        </div>
      )}

      <div className="lg:w-3/4 w-4/5 h-3/4 lg:h-screen border border-neutral-900 rounded-3xl lg:border-none lg:pt-20 backdrop-blur-2xl bg-white/30 dark:bg-gray-800 dark:border-gray-700">
        <h1 className="text-center text-4xl pt-10 lg:pt-24 dark:text-white">
          {" "}
          Login
        </h1>

        <form className="self-center mx-10 space-y-4 flex flex-col justify-center items-center lg:h-2/3 h-3/4">
          <ToggleButtonGroup
            value={role}
            exclusive
            onChange={handleRoleChange}
            aria-label="Role selection"
            className="mb-4 lg:w-5/6 mt-20 lg:mt-10"
          >
            <ToggleButton
              value="Client"
              className="w-1/2 dark:bg-gray-700 dark:text-white"
              sx={{
                backgroundColor: role === "Client" ? "black" : "",
                color: role === "Client" ? "white" : "",
                "&.Mui-selected": {
                  backgroundColor: "black",
                  color: "white",
                },
              }}
            >
              Client
            </ToggleButton>
            <ToggleButton
              value="Admin"
              className="w-1/2 dark:bg-gray-700 dark:text-white"
              sx={{
                backgroundColor: role === "Admin" ? "black" : "",
                color: role === "Admin" ? "white" : "",
                "&.Mui-selected": {
                  backgroundColor: "black",
                  color: "white",
                },
              }}
            >
              Admin
            </ToggleButton>
          </ToggleButtonGroup>
          <TextField
            label="Enter Email Id"
            variant="outlined"
            className={`lg:w-5/6 ${
              mode === "dark" ? "bg-gray-700 text-white border-gray-600" : ""
            }`}
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
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Enter Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            className="lg:w-5/6 dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                    className="dark:text-white"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <div className="flex text-gray-900 dark:text-gray-300">
            <input type="checkbox" name="remember" />
            <p className="text-xs ml-2 lg:text-base">Remember Me</p>
            <Link
              to="/reset-password"
              className="pl-10 text-neutral-400 text-xs lg:text-base dark:text-gray-400"
            >
              Forgot Password ?
            </Link>
          </div>
          <Button
            variant="contained"
            className="w-44 h-9 text-xl text-white"
            sx={{
              backgroundColor: mode === "dark" ? "#374151" : "#000000",
              "&:hover": {
                backgroundColor: mode === "dark" ? "#000000" : "#374151",
              },
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
          <span className="text-neutral-400 dark:text-gray-300">OR</span>
          <GoogleLogin
            size="medium"
            onSuccess={(credentialResponse) => {
              const idToken = credentialResponse.credential;
              if (!idToken) {
                toast.error("No token received", { position: "top-right" });
                return;
              }

              axios
                .post(
                  `${
                    role === "Client"
                      ? `${
                          import.meta.env.VITE_BACKEND_URL
                        }/api/user/google-login`
                      : `${
                          import.meta.env.VITE_BACKEND_URL
                        }/api/admin/google-login`
                  }`,
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
                        `${
                          role === "Client"
                            ? `/add-phone?email=${response.data.data.email}&name=${response.data.data.name}`
                            : `/admin/add-phone?email=${response.data.data.email}&name=${response.data.data.name}`
                        }`
                      );
                    } else if (response?.status === 200) {
                      dispatch(login(response.data.data));
                      navigate(
                        `${role === "Client" ? `/dashboard` : `/admin/home`}`
                      );
                    }
                  }, 2000);
                })
                .catch((error) => {
                  toast.error("Google login failed!", {
                    position: "top-right",
                  });
                });
            }}
            onError={() => {
              toast.error("Google Login Failed", { position: "top-right" });
            }}
          />
          <Link
            to="/register"
            className="text-sm text-blue-400 text-center hover:underline dark:text-blue-300"
          >
            Don't Have An Account?
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
