import React, { useState, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../frontend/src/Features/auth/auth.slice.js";
import {
  billDetsPage,
  costRangePage,
  drawerToogle,
  updatePage,
} from "../../../frontend/src/Features/pages/pages.slice.js";
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
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isUpdate = useSelector((state) => state.pages?.isUpdate);
  const isDrawer = useSelector((state) => state.pages?.drawer);
  const isbill = useSelector((state) => state.pages?.isbill);
  const isCostRange = useSelector((state) => state.pages?.isCostRange);

  const [cookies, setcookie, removeCookie] = useCookies(["authToken"]);

  const handleLogout = () => {
    if (isUpdate === true) {
      dispatch(updatePage());
    }
    if (isDrawer === true) {
      dispatch(drawerToogle());
    }
    if (role === "Client") {
      removeCookie("authToken", { path: "/" });
      dispatch(logout());
      navigate("/");
    } else {
      removeCookie("authToken", { path: "/" });
      dispatch(logout());
      navigate("/admin/login");

      if (isbill === true) {
        dispatch(billDetsPage());
      }
      if (isCostRange === true) {
        dispatch(costRangePage());
      }
    }
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

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/retrive-user`, options)
      .then((res) => {
        setEmail(res.data.data.email);
        setName(res.data.data.name);
        setPhonenno(res.data.data.phoneno);
        setRole(res.data.data.role);
        setState(res.data.data.state);
      })
      .catch((err) => {});
  }, []);

  if (role === "Client") {
    return (
      <Box className="flex flex-col items-center justify-center space-y-10 h-full lg:w-80 w-64 dark:bg-gray-800 lg:overflow-hidden dark:text-white">
        <ToastContainer />
        <MessageDialog
          open={open}
          handleClose={handleClose}
          message={message}
          role={role}
        />

        <div className="flex space-x-6 ml-8 dark:bg-gray-800">
          <Avatar alt="User Avatar" src="" className="mt-10" />
          <EditIcon onClick={handleEdit} className="mt-11" />
        </div>

        {/* Role */}
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

        {/* Name */}
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

        {/* Email */}
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

        {/* Phone Number */}
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

        {/* State */}
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

        {/* Delete Button */}
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
      <>
        <Box className="flex flex-col items-center h-full justify-center space-y-12 lg:w-80 w-64 dark:bg-gray-800 overflow-hidden">
          <ToastContainer />
          <MessageDialog
            open={open}
            handleClose={handleClose}
            message={message}
            role={role}
          />
          <div className="flex space-x-6 ml-8 dark:bg-gray-800">
            <Avatar alt="User Avatar" src="" className="mt-10" />
            <EditIcon onClick={handleEdit} className="mt-11" />
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
            }}            value={role}
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
            }}            value={name}
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
            }}            value={email}
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
            }}            value={phoneno}
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
            onClick={handleLogout}
          >
            <LogoutIcon />
            Logout
          </Button>
        </Box>
      </>
    );
  }
};

export default Sidebar;
