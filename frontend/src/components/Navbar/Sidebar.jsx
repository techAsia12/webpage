import React, { useState, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Features/auth/auth.slice.js";
import {
  drawerToogle,
  updatePage,
} from "../../Features/pages/pages.slice.js";
import { Edit as EditIcon } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import { toast, ToastContainer } from "react-toastify";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { IoCameraOutline } from "react-icons/io5";

const MessageDialog = ({ open, handleClose, message, role }) => {
  const navigate = useNavigate();

  const options = {
    withCredentials: true,
  };

  const handleDelete = () => {
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/api/user/delete`, options)
      .then((res) => {
        handleClose();
        toast.success(res.data.message || "Account Deleted Successfully");
        if (role === "Client") {
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          {
            setTimeout(() => {
              navigate("/admin/login");
            }, 2000);
          }
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };
  
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Alert!</DialogTitle>
      <DialogContent>
        <p>{message}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
        <Button onClick={handleDelete}> Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

const Sidebar = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [role, setRole] = useState();
  const [phoneno, setPhonenno] = useState();
  const [state, setState] = useState();
  const [profile, setProfile] = useState();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isUpdate = useSelector((state) => state.pages?.isUpdate);
  const isDrawer = useSelector((state) => state.pages?.drawer);
  const [cookies, setcookie, removeCookie] = useCookies(["authToken"]);

  const handleLogout = () => {
    if (isUpdate === true) {
      dispatch(updatePage());
    }
    if (isDrawer === true) {
      dispatch(drawerToogle());
    }

    removeCookie("authToken", { path: "/" });
    dispatch(logout());
    navigate("/");
  };

  const options = {
    withCredentials: true,
  };

  const handleClickOpen = (msg) => {
    setMessage(msg);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = () => {
    dispatch(updatePage());
    dispatch(drawerToogle());
  };

  const handleUploadProfile = (e) => {
    const profile = e.target.files[0];
    const form = new FormData();
    form.append("profile", profile);
    console.log(profile);
    if (profile) {
      const endpoint =
        role === "Admin"
          ? `${import.meta.env.VITE_BACKEND_URL}/api/admin/profileUpdate`
          : `${import.meta.env.VITE_BACKEND_URL}/api/user/profileUpdate`;

      axios
        .post(endpoint, form, options)
        .then((res) => {
          console.log(res.data.data);
          setProfile(res.data.data);
          toast.success("Profile updated successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        })
        .catch((err) => {
          const errorMessage =
            err.response?.data?.message ||
            "Failed to update profile. Please try again.";
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setProfile(null);
        });
    } else {
      toast.error("Please select a profile image to upload.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/retrive-user`, options)
      .then((res) => {
        setEmail(res.data.data.email);
        setName(res.data.data.name);
        setPhonenno(res.data.data.phoneno);
        setRole(res.data.data.role);
        setState(res.data.data.state);
        setProfile(res.data.data.profile);
      })
      .catch((err) => {});
  }, []);

  if (role === "Client") {
    return (
      <Box className="flex flex-col items-center justify-center space-y-10 h-full lg:w-80 w-64 dark:bg-gray-800 :text-white ">
        <ToastContainer />
        <MessageDialog
          open={open}
          handleClose={handleClose}
          message={message}
          role={role}
        />

        <div className="flex space-x-6 ml-8 dark:bg-gray-800">
          <Avatar
            alt="User Avatar"
            src={`${profile}` || ""}
            className="mt-10 z-0 "
            sx={{ width: 100, height: 100 }}
          />
          <label className="z-30 absolute mt-12 transform -translate-x-4 hover:cursor-pointer overflow-hidden">
            <IoCameraOutline
              className="backdrop-blur-[2px] opacity-0 hover:opacity-100 transition-opacity rounded-full"
              size={85}
            />

            <input
              type="file"
              className="absolute z-40 rounded-full mt-20 transform -translate-x-6 opacity-0 cursor-pointer"
              accept="image/*"
              onChange={handleUploadProfile}
            />
          </label>
          <EditIcon onClick={handleEdit} className="mt-16" />
        </div>

        <TextField
          variant="outlined"
          value={role}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          className="w-4/5"
          sx={{
            "& .MuiInputBase-input": {
              color: "black",
              border: "2px solid white",
              "&.Mui-focused": {
                color: "black",
                border: "2px solid white",
              },
            },
            "&.Mui-focused .MuiInputBase-input": {
              color: "black",
              border: "2px solid white",
            },
            ".dark & .MuiInputBase-input": {
              color: "white",
              border: "2px solid white",
            },
            ".dark & .MuiInputBase-input.Mui-focused": {
              color: "white",
              border: "2px solid white",
            },
            ".dark & .MuiSelect-icon": {
              color: "white",
            },
            ".dark & .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
            "& .MuiSelect-icon": {
              color: "black",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "black",
            },
          }}
        />

        <TextField
          type="text"
          variant="outlined"
          value={name}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          className="w-4/5"
          sx={{
            "& .MuiInputBase-input": {
              color: "black",
              border: "2px solid white",
              "&.Mui-focused": {
                color: "black",
                border: "2px solid white",
              },
            },
            "&.Mui-focused .MuiInputBase-input": {
              color: "black",
              border: "2px solid white",
            },
            ".dark & .MuiInputBase-input": {
              color: "white",
              border: "2px solid white",
            },
            ".dark & .MuiInputBase-input.Mui-focused": {
              color: "white",
              border: "2px solid white",
            },
            ".dark & .MuiSelect-icon": {
              color: "white",
            },
            ".dark & .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
            "& .MuiSelect-icon": {
              color: "black",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "black",
            },
          }}
        />

        <TextField
          type="email"
          variant="outlined"
          value={email}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          className="w-4/5"
          sx={{
            "& .MuiInputBase-input": {
              color: "black",
              border: "2px solid white",
              "&.Mui-focused": {
                color: "black",
                border: "2px solid white",
              },
            },
            "&.Mui-focused .MuiInputBase-input": {
              color: "black",
              border: "2px solid white",
            },
            ".dark & .MuiInputBase-input": {
              color: "white",
              border: "2px solid white",
            },
            ".dark & .MuiInputBase-input.Mui-focused": {
              color: "white",
              border: "2px solid white",
            },
            ".dark & .MuiSelect-icon": {
              color: "white",
            },
            ".dark & .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
            "& .MuiSelect-icon": {
              color: "black",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "black",
            },
          }}
        />

        <TextField
          type="number"
          variant="outlined"
          value={phoneno}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          className="w-4/5"
          sx={{
            "& .MuiInputBase-input": {
              color: "black",
              border: "2px solid white",
              "&.Mui-focused": {
                color: "black",
                border: "2px solid white",
              },
            },
            "&.Mui-focused .MuiInputBase-input": {
              color: "black",
              border: "2px solid white",
            },
            ".dark & .MuiInputBase-input": {
              color: "white",
              border: "2px solid white",
            },
            ".dark & .MuiInputBase-input.Mui-focused": {
              color: "white",
              border: "2px solid white",
            },
            ".dark & .MuiSelect-icon": {
              color: "white",
            },
            ".dark & .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
            "& .MuiSelect-icon": {
              color: "black",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "black",
            },
          }}
        />

        <TextField
          type="text"
          variant="outlined"
          value={state}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          className="w-4/5"
          sx={{
            "& .MuiInputBase-input": {
              color: "black",
              border: "2px solid white",
              "&.Mui-focused": {
                color: "black",
                border: "2px solid white",
              },
            },
            "&.Mui-focused .MuiInputBase-input": {
              color: "black",
              border: "2px solid white",
            },
            ".dark & .MuiInputBase-input": {
              color: "white",
              border: "2px solid white",
            },
            ".dark & .MuiInputBase-input.Mui-focused": {
              color: "white",
              border: "2px solid white",
            },
            ".dark & .MuiSelect-icon": {
              color: "white",
            },
            ".dark & .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
            "& .MuiSelect-icon": {
              color: "black",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "black",
            },
          }}
        />

        <Button
          variant="contained"
          className="border border-neutral-900 w-44 h-9 text-xl bg-red-500 text-white hover:bg-white hover:text-black dark:bg-red-700 dark:hover:bg-red-600"
          color="error"
          readOnly
          onClick={() =>
            handleClickOpen("Are you sure you want to delete your account?")
          }
        >
          <DeleteIcon />
          Delete
        </Button>

        <Button
          variant="contained"
          className="border border-neutral-900 w-44 h-9 text-xl hover:bg-white hover:text-black dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={handleLogout}
        >
          <LogoutIcon />
          Logout
        </Button>

        <div></div>
      </Box>
    );
  } else {
    return (
      <Box className="flex flex-col items-center justify-center space-y-10 h-full lg:w-80 w-64 dark:bg-gray-800 lg:overflow-hidden dark:text-white ">
        <ToastContainer />
        <MessageDialog
          open={open}
          handleClose={handleClose}
          message={message}
          role={role}
        />
        <div className="flex space-x-6 ml-8 dark:bg-gray-800">
          <Avatar
            alt="User Avatar"
            src={`${profile}` || ""}
            className="mt-10 z-0 "
            sx={{ width: 100, height: 100 }}
          />
          <label className="z-30 absolute mt-12 transform -translate-x-4 hover:cursor-pointer overflow-hidden">
            <IoCameraOutline
              className="backdrop-blur-[2px] opacity-0 hover:opacity-100 transition-opacity rounded-full"
              size={85}
            />

            <input
              type="file"
              className="absolute z-40 rounded-full mt-20 transform -translate-x-6 opacity-0 cursor-pointer"
              accept="image/*"
              onChange={handleUploadProfile}
            />
          </label>
          <EditIcon onClick={handleEdit} className="mt-16" />
        </div>

        <TextField
          variant="outlined"
          className="w-4/5"
          sx={{
            "& .MuiInputBase-input": {
              color: "black",
              border: "2px solid white",
              "&.Mui-focused": {
                color: "black",
                border: "2px solid white",
              },
            },
            "&.Mui-focused .MuiInputBase-input": {
              color: "black",
              border: "2px solid white",
            },
            ".dark & .MuiInputBase-input": {
              color: "white",
              border: "2px solid white",
            },
            ".dark & .MuiInputBase-input.Mui-focused": {
              color: "white",
              border: "2px solid white",
            },
            ".dark & .MuiSelect-icon": {
              color: "white",
            },
            ".dark & .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
            "& .MuiSelect-icon": {
              color: "black",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "black",
            },
          }}
          value={role}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />
        <TextField
          type="text"
          variant="outlined"
          className="w-4/5"
          sx={{
            "& .MuiInputBase-input": {
              color: "black",
              border: "2px solid white",
              "&.Mui-focused": {
                color: "black",
                border: "2px solid white",
              },
            },
            "&.Mui-focused .MuiInputBase-input": {
              color: "black",
              border: "2px solid white",
            },
            ".dark & .MuiInputBase-input": {
              color: "white",
              border: "2px solid white",
            },
            ".dark & .MuiInputBase-input.Mui-focused": {
              color: "white",
              border: "2px solid white",
            },
            ".dark & .MuiSelect-icon": {
              color: "white",
            },
            ".dark & .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
            "& .MuiSelect-icon": {
              color: "black",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "black",
            },
          }}
          value={name}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />
        <TextField
          type="email"
          variant="outlined"
          className="w-4/5"
          sx={{
            "& .MuiInputBase-input": {
              color: "black",
              border: "2px solid white",
              "&.Mui-focused": {
                color: "black",
                border: "2px solid white",
              },
            },
            "&.Mui-focused .MuiInputBase-input": {
              color: "black",
              border: "2px solid white",
            },
            ".dark & .MuiInputBase-input": {
              color: "white",
              border: "2px solid white",
            },
            ".dark & .MuiInputBase-input.Mui-focused": {
              color: "white",
              border: "2px solid white",
            },
            ".dark & .MuiSelect-icon": {
              color: "white",
            },
            ".dark & .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
            "& .MuiSelect-icon": {
              color: "black",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "black",
            },
          }}
          value={email}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />
        <TextField
          type="number"
          variant="outlined"
          className="w-4/5"
          sx={{
            "& .MuiInputBase-input": {
              color: "black",
              border: "2px solid white",
              "&.Mui-focused": {
                color: "black",
                border: "2px solid white",
              },
            },
            "&.Mui-focused .MuiInputBase-input": {
              color: "black",
              border: "2px solid white",
            },
            ".dark & .MuiInputBase-input": {
              color: "white",
              border: "2px solid white",
            },
            ".dark & .MuiInputBase-input.Mui-focused": {
              color: "white",
              border: "2px solid white",
            },
            ".dark & .MuiSelect-icon": {
              color: "white",
            },
            ".dark & .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
            "& .MuiSelect-icon": {
              color: "black",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "black",
            },
          }}
          value={phoneno}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />

        <Button
          variant="contained"
          className="border border-neutral-900 w-44 h-9 text-xl bg-red-500 text-white hover:bg-white hover:text-black dark:bg-red-700 dark:hover:bg-red-600"
          color="error"
          readOnly
          onClick={() =>
            handleClickOpen("Are you sure you want to delete your account?")
          }
        >
          <DeleteIcon />
          Delete
        </Button>

        <Button
          variant="contained"
          className="border border-neutral-900 w-44 h-9 text-xl hover:bg-white hover:text-black dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={() => {
            handleLogout, navigate("/");
          }}
        >
          <LogoutIcon />
          Logout
        </Button>
      </Box>
    );
  }
};

export default Sidebar;
