import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import TextField from "@mui/material/TextField";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { login } from "../../Features/auth/auth.slice";
import  SideBarAnimation from "../SideBarAnimation.jsx";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const options = { withCredentials: true };

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/login`,
        { email, password, role: "Admin" },
        options
      )
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res.data.message || "Login successful!", {
            position: "top-right",
          });
          setTimeout(() => {
            dispatch(login(res.data.data.user));
            navigate("/admin/home");
          }, 2000);
        }
      })
      .catch((error) => {
        const errorMsg = error?.response?.data?.message || "Login failed!";
        toast.error(errorMsg, { position: "top-right" });
      });
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center lg:flex-none bg-slate-200">
      <ToastContainer />
      <SideBarAnimation />
      <div className="lg:w-3/4 w-4/5 h-3/4  lg:h-screen border border-neutral-900 rounded-3xl lg:border-none lg:pt-20 backdrop-blur-2xl bg-white/30 ">
        <h1 className="text-center text-4xl pt-10 lg:pt-24">Admin Login</h1>
        <form className="self-center mx-10 mt-6 space-y-4 flex flex-col justify-center items-center lg:h-2/3 h-3/4">
          <TextField
            label="Enter Email Id"
            variant="outlined"
            className="lg:w-5/6"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Enter Password"
            variant="outlined"
            type="password"
            className="lg:w-5/6"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex">
            <input type="checkbox" name="remember" />
            <p className="text-xs ml-2 lg:text-base">Remember Me</p>
            <Link
              to="/reset-password"
              className="pl-10 text-neutral-400 text-xs lg:text-base"
            >
              Forgot Password
            </Link>
          </div>
          <Button
            variant="contained"
            className="border border-neutral-900 w-44 h-9 text-xl"
            onClick={handleSubmit}
          >
            Login
          </Button>
          <span className="text-neutral-400">OR</span>
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
                      console.log(response.data.data);
                      dispatch(login(response.data.data));
                      navigate("/admin/home");
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
            to="/admin/register"
            className="text-sm text-blue-400 text-center hover:underline"
          >
            Don't Have An Account?
          </Link>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
