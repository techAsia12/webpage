import { React, useState, useEffect } from "react";
import { Box, Typography, CardContent } from "@mui/material";
import { motion } from "framer-motion";

const Meter = ({
  color,
  value,
  maxValue,
  unit,
  initial,
  animate,
  transition,
}) => {
  const progress = (value / maxValue) * 100;
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const totalSegments = 30;
  const filledSegments = Math.round((progress / 100) * totalSegments);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isSmallScreen = screenWidth < 600;

  return (
    <motion.Card
      className={`w-full shadow-lg rounded-3xl bg-white dark:bg-neutral-900 dark:text-neutral-400 border`}
      initial={initial}
      animate={animate}
      transition={{ duration: 1 }}
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
          <Box
            sx={{
              position: "relative",
              width: isSmallScreen ? "200px" : "300px",
              height: isSmallScreen ? "200px" : "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
              />
            ))}

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
            />

            <Typography
              variant="h4"
              component="div"
              sx={{
                fontSize: isSmallScreen ? "1.5rem" : "2rem",
                fontWeight: "bold",
                color: color,
                position: "relative",
                zIndex: 3, 
              }}
            >
              {`${Math.round(value)}${unit}`}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              mt: isSmallScreen ? 1 : 2,
              px: isSmallScreen ? 2 : 4,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: isSmallScreen ? "0.8rem" : "1rem",
                color: "text.secondary",
              }}
            >
              {`0${unit}`}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: isSmallScreen ? "0.8rem" : "1rem",
                color: "text.secondary",
              }}
            >
              {`${maxValue}${unit}`}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </motion.Card>
  );
};

export default Meter;
