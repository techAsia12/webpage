import React, { useState } from "react";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import { useNavigate } from "react-router-dom";

/**
 * NavDial Component
 * 
 * A floating action button (FAB) with a speed dial for quick navigation actions.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.actions - Array of actions with name, icon, and path
 * @returns {JSX.Element} - Rendered NavDial component
 */
const NavDial = ({ actions }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  /**
   * Toggles the speed dial open/close state.
   */
  const handleIconClick = () => {
    setOpen(!open);
  };

  /**
   * Handles navigation to the specified path and closes the speed dial.
   * 
   * @param {string} path - The path to navigate to
   */
  const handleActionClick = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <SpeedDial
      ariaLabel="SpeedDial for quick actions"
      className="absolute bottom-10 right-8"
      icon={<SpeedDialIcon />}
      open={open}
      onClose={() => setOpen(false)}
      onClick={handleIconClick}
      sx={{
        "& .MuiSpeedDial-fab": {
          backgroundColor: "#3f51b5", // Primary color for the FAB
          color: "#ffffff", // White text/icons
          "&:hover": {
            backgroundColor: "#303f9f", // Darker shade on hover
          },
        },
      }}
      role="navigation"
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={() => handleActionClick(action.path)}
          sx={{
            backgroundColor: "#ff4081", // Secondary color for actions
            color: "#ffffff", // White text/icons
            "&:hover": {
              backgroundColor: "#f50057", // Darker shade on hover
            },
          }}
          aria-label={action.name} // Accessibility label for each action
        />
      ))}
    </SpeedDial>
  );
};

export default NavDial;