import React, { useState } from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { useNavigate } from "react-router-dom";

const NavDial = ({actions}) => {
  const [open, setOpen] = useState(false);
  const navigate=useNavigate();

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
        className="absolute bottom-10 right-8 "
        icon={<SpeedDialIcon />}
        open={open}
        onClose={() => setOpen(false)}
        onClick={handleIconClick}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => handleActionClick(action.path)}
          />
        ))}
      </SpeedDial>
  );
};

export default NavDial;
