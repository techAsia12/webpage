import React, { useState } from "react";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const NavDial = ({ actions }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleIconClick = () => {
    setOpen(!open);
    console.log(open);
  };

  const handleActionClick = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
<SpeedDial
  ariaLabel="SpeedDial basic example"
  className="absolute bottom-10 right-8"
  icon={<SpeedDialIcon />}
  open={open}
  onClose={() => setOpen(false)}
  onClick={handleIconClick}
  sx={{
    "& .MuiSpeedDial-fab": {
      backgroundColor: "#3f51b5", 
      color: "#ffffff", 
      "&:hover": {
        backgroundColor: "#303f9f", 
      },
    },
  }}
>
  {actions.map((action) => (
    <SpeedDialAction
      key={action.name}
      icon={action.icon}
      tooltipTitle={action.name}
      onClick={() => handleActionClick(action.path)}
      sx={{
        backgroundColor: "#ff4081",
        color: "#ffffff", 
        "&:hover": {
          backgroundColor: "#f50057", 
        },
      }}
    />
  ))}
</SpeedDial>
  );
};

export default NavDial;