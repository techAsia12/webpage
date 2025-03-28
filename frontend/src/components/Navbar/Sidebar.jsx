import React, { useState, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Features/auth/auth.slice.js";
import { drawerToogle, updatePage } from "../../Features/pages/pages.slice.js";
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

/**
 * MessageDialog Component
 *
 * A dialog component to confirm account deletion.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.handleClose - Function to close the dialog
 * @param {string} props.message - The message to display in the dialog
 * @param {string} props.role - The role of the user (Client or Admin)
 * @returns {JSX.Element} - Rendered MessageDialog component
 */
const MessageDialog = ({ open, handleClose, message, role }) => {
  const navigate = useNavigate();
  const options = { withCredentials: true };

  const handleDelete = () => {
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/api/user/delete`, options)
      .then((res) => {
        handleClose();
        toast.success(res.data.message || "Account Deleted Successfully");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      role="alertdialog"
      aria-label="Delete Account Confirmation"
    >
      <DialogTitle>Alert!</DialogTitle>
      <DialogContent>
        <p>{message}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" aria-label="Close Dialog">
          Close
        </Button>
        <Button onClick={handleDelete} aria-label="Confirm Delete Account">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/**
 * Sidebar Component
 *
 * A sidebar component that displays user information and provides actions like logout and account deletion.
 *
 * @returns {JSX.Element} - Rendered Sidebar component
 */
const Sidebar = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [state, setState] = useState("");
  const [profile, setProfile] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [textFieldArray, setTextFieldArray] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isUpdate = useSelector((state) => state.pages?.isUpdate);
  const isDrawer = useSelector((state) => state.pages?.drawer);
  const [cookies, , removeCookie] = useCookies(["authToken"]);

  const options = { withCredentials: true };

  useEffect(() => {
    if (role === "Admin") {
      setTextFieldArray([
        { label: "Role", value: role },
        { label: "Name", value: name },
        { label: "Email", value: email },
        { label: "Phone Number", value: phoneno },
      ]);
    } else {
      setTextFieldArray([
        { label: "Role", value: role },
        { label: "Name", value: name },
        { label: "Email", value: email },
        { label: "Phone Number", value: phoneno },
        { label: "State", value: state },
      ]);
    }
  }, [role]);

  // Fetch user data on component mount
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/retrive-user`, options)
      .then((res) => {
        setEmail(res.data.data.email);
        setName(res.data.data.name);
        setPhoneno(res.data.data.phoneno);
        setRole(res.data.data.role);
        setState(res.data.data.state);
        setProfile(res.data.data.profile);
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
      });
  }, []);

  // Handle logout
  const handleLogout = () => {
    if (isUpdate) dispatch(updatePage());
    if (isDrawer) dispatch(drawerToogle());
    dispatch(logout());
    removeCookie("authToken", { path: "/" });
    navigate("/login");
  };

  // Handle opening the delete confirmation dialog
  const handleClickOpen = (msg) => {
    setMessage(msg);
    setOpen(true);
  };

  // Handle closing the delete confirmation dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Handle edit action
  const handleEdit = () => {
    dispatch(updatePage());
    dispatch(drawerToogle());
  };

  // Handle profile picture upload
  const handleUploadProfile = (e) => {
    const profile = e.target.files[0];
    const form = new FormData();
    form.append("profile", profile);

    if (profile) {
      const endpoint =
        role === "Admin"
          ? `${import.meta.env.VITE_BACKEND_URL}/api/admin/profileUpdate`
          : `${import.meta.env.VITE_BACKEND_URL}/api/user/profileUpdate`;

      axios
        .post(endpoint, form, options)
        .then((res) => {
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

  // Render the sidebar based on the user role
  return (
    <Box className="flex flex-col items-center justify-center space-y-8  lg:w-80 w-64 h-screen dark:bg-gray-900 dark:text-white">
      <ToastContainer />
      <MessageDialog
        open={open}
        handleClose={handleClose}
        message={message}
        role={role}
      />
      {/* Profile Section */}
      <div className="flex space-x-6 ml-8 dark:bg-gray-900">
        <Avatar
          alt="User Avatar"
          src={`${profile}` || ""}
          className="z-0"
          sx={{ width: 100, height: 100 }}
          aria-label="User Avatar"
        />
        <label className="z-30 absolute mt-1 transform -translate-x-4 hover:cursor-pointer overflow-hidden">
          <IoCameraOutline
            className="backdrop-blur-[2px] opacity-0 hover:opacity-100 transition-opacity rounded-full"
            size={85}
            aria-label="Upload Profile Picture"
          />
          <input
            type="file"
            className="absolute z-40 rounded-full mt-20 transform -translate-x-6 opacity-0 cursor-pointer"
            accept="image/*"
            onChange={handleUploadProfile}
            aria-label="Profile Picture Upload"
          />
        </label>
        <EditIcon
          onClick={handleEdit}
          className="mt-8"
          aria-label="Edit Profile"
        />
      </div>
      {/* User Information Fields */}
      {textFieldArray.map((field, index) => (
        <TextField
          key={index}
          variant="outlined"
          className="w-4/5"
          value={field.value}
          slotProps={{ input: { readOnly: true } }}
          sx={{
            "& .MuiInputBase-input": {
              color: "black",
              "&.Mui-focused": { color: "black" },
            },
            ".dark & .MuiInputBase-input": { color: "white" },
            ".dark & .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "black" },
          }}
          aria-label={field.label}
        />
      ))}
      {/* Delete and Logout Buttons */}
      <Button
        variant="contained"
        className="border border-neutral-900 w-44 h-9 text-xl text-white hover:bg-red-500"
        color="error"
        onClick={() =>
          handleClickOpen("Are you sure you want to delete your account?")
        }
        aria-label="Delete Account"
      >
        <DeleteIcon />
        Delete
      </Button>
      <Button
        variant="contained"
        className="border border-neutral-900 w-44 h-9 text-xl dark:bg-[#3f51b5] dark:hover:bg-[#4963c7] hover:bg-white hover:text-black dark:hover:text-white"
        onClick={() => {
          handleLogout();
        }}
        aria-label="Logout"
      >
        <LogoutIcon />
        Logout
      </Button>
    </Box>
  );
};

export default Sidebar;
