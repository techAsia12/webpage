import { React, useState, useEffect } from "react";
import { Box, Typography, CardContent } from "@mui/material";
import { motion } from "framer-motion";

/**
 * Meter Component
 *
 * A circular progress meter that visually represents a value relative to a maximum value.
 * It uses segments to indicate progress and supports responsive design for small screens.
 *
 * @param {Object} props - Component props
 * @param {string} props.color - Color of the filled segments
 * @param {number} props.value - Current value to display
 * @param {number} props.maxValue - Maximum value for the meter
 * @param {string} props.unit - Unit of the value (e.g., "%", "°C")
 * @param {Object} props.initial - Initial animation state (Framer Motion)
 * @param {Object} props.animate - Target animation state (Framer Motion)
 * @returns {JSX.Element} - Rendered Meter component
 */
const Meter = ({ color, value, maxValue, unit, initial, animate }) => {
  // Calculate the progress percentage
  const progress = (value / maxValue) * 100;

  // Track screen width for responsive design
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Total number of segments in the meter
  const totalSegments = 30;

  // Number of filled segments based on progress
  const filledSegments = Math.round((progress / 100) * totalSegments);

  // Update screen width on window resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Check if the screen is small (less than 600px)
  const isSmallScreen = screenWidth < 600;

  return (
    <motion.Card
      className={`w-full shadow-lg rounded-3xl bg-white dark:bg-neutral-900 dark:text-neutral-400 border`}
      initial={initial}
      animate={animate}
      transition={{ duration: 1 }}
      role="figure"
      aria-label="Circular progress meter"
    >
      <CardContent>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {/* Circular Meter Container */}
          <Box
            sx={{
              position: "relative",
              width: isSmallScreen ? "200px" : "300px",
              height: isSmallScreen ? "200px" : "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Meter visualization"
          >
            {/* Render Segments */}
            {Array.from({ length: totalSegments }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  position: "absolute",
                  width: "8px",
                  height: "50%",
                  backgroundColor:
                    index < filledSegments ? color : "rgba(224, 224, 224, 0.5)",
                  borderRadius: "2px",
                  transform: `rotate(${(360 / totalSegments) * index}deg)`,
                  transformOrigin: "bottom center",
                  top: "1%",
                  left: "50%",
                  zIndex: 1,
                }}
                aria-hidden="true" // Hide from screen readers (visual-only element)
              />
            ))}

            {/* Inner Circle */}
            <Box
              sx={{
                position: "absolute",
                width: "60%",
                height: "60%",
                borderRadius: "50%",
                boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.1)",
                zIndex: 2,
              }}
              className="bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,0,0,0.2),rgba(0,0,0,0))] dark:bg-neutral-950 dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"
              aria-hidden="true" // Hide from screen readers (visual-only element)
            />

            {/* Display Value */}
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontSize: isSmallScreen ? "1.5rem" : "2rem",
                fontWeight: "bold",
                color: color,
                position: "relative",
                zIndex: 3,
                wordWrap: "break-word",
                overflow:"visible",
                whiteSpace:"normal",
              }}
              aria-label={`Current value: ${Math.round(value)}${unit}`}
            >
              <div>{Math.round(value)}</div> {/* Displaying the number */}
              <div>
                {unit}
              </div> {/* Displaying the unit below the number */}{" "}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </motion.Card>
  );
};

export default Meter;
