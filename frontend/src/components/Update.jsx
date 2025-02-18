import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Box,
  Select,
  Button,
  Avatar,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { Edit as EditIcon, Check as CheckIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { updatePage } from "../Features/pages/pages.slice";
import CancelIcon from "@mui/icons-material/Cancel";

const Update = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [role, setRole] = useState();
  const [selectedState, setSelectedState] = useState();
  const [selectedServiceProvider, setSelectedServiceProvider] = useState();
  const [states, setStates] = useState([]);
  const dispatch = useDispatch();
  const [isNameReadOnly, setIsNameReadOnly] = useState(true);
  const [isEmailReadOnly, setIsEmailReadOnly] = useState(true);

  const toggleFieldReadOnly = (field) => {
    switch (field) {
      case "name":
        setIsNameReadOnly((prev) => !prev);
        break;
      case "email":
        setIsEmailReadOnly((prev) => !prev);
        break;
      default:
        break;
    }
  };

  const options = {
    withCredentials: true,
  };

  const handleStateChange = (event) => {
    const state = event.target.value;
    setSelectedState(state);
    setSelectedServiceProvider("");
  };

  const getStateName = (stateString) => {
    return stateString.split("_")[1];
  };

  const getServiceProvider = (stateString) => {
    return stateString.split("_")[0];
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/retrive-stateDets`)
      .then((res) => {
        setStates(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/retrive-user`, options)
      .then((res) => {
        setRole(res.data.data.role);
        setName(res.data.data.name);
        setEmail(res.data.data.email);
      })
      .catch((err) => {
        toast.error("Failed to load user data.");
      });
  }, []);

  const handleSubmit = () => {
    if(role==="Client"){
      axios
        .post(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/update`,
          { name, email, selectedServiceProvider },
          options
        )
        .then((res) => {
          toast.success(res.data.message || "Updates successful!", {
            position: "top-right",
          });
          dispatch(login(res.data.data))
          setTimeout(() => {
            dispatch(updatePage());
          }, 1000);
        })
        .catch((err) => {
          console.log(err.response.data.message);
          toast.error(`Error: ${err.response.data.message}`);
        })
    }else{
      axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/update`,
        { name, email },
        options
      )
      .then((res) => {
        toast.success(res.data.message || "Updates successful!", {
          position: "top-right",
        });
        
        setTimeout(() => {
          dispatch(updatePage());
        }, 1000);
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast.error(`Error: ${err.response.data.message}`);
      })
    }
  };

  if (role === "Client") {
    return (
      <div className="w-screen h-screen flex justify-center items-center overflow-hidden ">
        <Box className="flex items-center justify-center lg:space-y-10 space-y-5 w-3/4 lg:w-1/3 h-5/6 border border-neutral-900 rounded-3xl dark:border-2 dark:border-white dark:text-white">
          <CancelIcon
            className="transform lg:-translate-x-10"
            color="error"
            onClick={() => {
              dispatch(updatePage());
            }}
            fontSize="large"
          />
          <Avatar alt="User Avatar" src="" sx={{ width: 60, height: 60 }} />
          <TextField
            variant="outlined"
            className="lg:w-5/6 w-3/4 dark:bg-gray-700 dark:text-white dark:border-white"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              readOnly: isNameReadOnly,
              endAdornment: (
                <InputAdornment
                  position="end"
                  onClick={() => toggleFieldReadOnly("name")}
                  style={{ cursor: "pointer", padding: "0 8px" }}
                >
                  {isNameReadOnly ? <EditIcon /> : <CheckIcon />}
                </InputAdornment>
              ),
            }}
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
            onFocus={() => setIsNameReadOnly(false)}
          />
          <TextField
            type="email"
            variant="outlined"
            className="lg:w-5/6 w-3/4 dark:bg-gray-700 dark:text-white dark:border-white"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              readOnly: isEmailReadOnly,
              endAdornment: (
                <InputAdornment
                  position="end"
                  onClick={() => toggleFieldReadOnly("email")}
                  style={{ cursor: "pointer", padding: "0 8px" }}
                >
                  {isEmailReadOnly ? <EditIcon /> : <CheckIcon />}
                </InputAdornment>
              ),
            }}
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
            onFocus={() => setIsEmailReadOnly(false)}
          />
          <FormControl className="lg:w-5/6 w-3/4" margin="normal">
            <InputLabel
              sx={{
                color: "black",
                ".dark &": {
                  color: "white",
                },
              }}
            >
              State
            </InputLabel>
            <Select
              label="State"
              value={selectedState}
              onChange={handleStateChange}
              sx={{
                "& .MuiInputBase-input": {
                  color: "black",
                },
                "&.Mui-focused .MuiInputBase-input": {
                  color: "black",
                },
                ".dark & .MuiInputBase-input": {
                  color: "white",
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
            >
              {states.map((stateObj) => (
                <MenuItem key={stateObj.state} value={stateObj.state}>
                  {getStateName(stateObj.state)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            className="lg:w-5/6 w-3/4"
            margin="normal"
            disabled={!selectedState}
          >
            <InputLabel
              sx={{
                color: "black",
                ".dark &": {
                  color: "white",
                },
              }}
            >
              Service Provider
            </InputLabel>
            <Select
              label="Service Provider"
              value={selectedServiceProvider}
              onChange={(e) => setSelectedServiceProvider(e.target.value)}
              sx={{
                "& .MuiInputBase-input": {
                  color: "black",
                },
                "&.Mui-focused .MuiInputBase-input": {
                  color: "black",
                },
                ".dark & .MuiInputBase-input": {
                  color: "white",
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
            >
              {states
                .filter((stateObj) => stateObj.state.includes(selectedState))
                .map((stateObj) => (
                  <MenuItem key={stateObj.state} value={stateObj.state}>
                    {getServiceProvider(stateObj.state)}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            className="border border-neutral-900 w-44 h-9 text-xl dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </div>
    );
  } else {
    return (
      <div className="w-screen h-screen flex justify-center items-center dark:bg-gray-800 dark:text-white">
        <Box className="flex flex-col items-center justify-center space-y-10 w-3/4 lg:w-1/3 h-3/4 border transform -translate-y-28 border-neutral-900 rounded-3xl dark:border-2 dark:border-white">
          <CancelIcon
            className="ml-64 transform lg:-translate-y-10 lg:ml-96 right-0 "
            color="error"
            onClick={() => {
              dispatch(updatePage());
            }}
            fontSize="large"
          />
          <Avatar alt="User Avatar" src="" sx={{ width: 60, height: 60 }} />
          <TextField
            variant="outlined"
            className="lg:w-5/6 w-3/4 dark:bg-gray-700 dark:text-white dark:border-white"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              readOnly: isNameReadOnly,
              endAdornment: (
                <InputAdornment
                  position="end"
                  onClick={() => toggleFieldReadOnly("name")}
                  style={{ cursor: "pointer", padding: "0 8px" }}
                >
                  {isNameReadOnly ? <EditIcon /> : <CheckIcon />}
                </InputAdornment>
              ),
            }}
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
            }}
            onFocus={() => setIsNameReadOnly(false)}
          />
          <TextField
            type="email"
            variant="outlined"
            className="lg:w-5/6 w-3/4 dark:bg-gray-700 dark:text-white dark:border-white"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              readOnly: isEmailReadOnly,
              endAdornment: (
                <InputAdornment
                  position="end"
                  onClick={() => toggleFieldReadOnly("email")}
                  style={{ cursor: "pointer", padding: "0 8px" }}
                >
                  {isEmailReadOnly ? <EditIcon /> : <CheckIcon />}
                </InputAdornment>
              ),
            }}
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
            }}
            onFocus={() => setIsEmailReadOnly(false)}
          />
          <Button
            variant="contained"
            className="border border-neutral-900 w-44 h-9 text-xl dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </div>
    );
  }
};

export default Update;
