import React, { useEffect, useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate,useLocation } from "react-router-dom";

const SecondBoxItems = [
  { text: "Observations", link: "/explore" },
  { text: "Species", link: "/explore/species" },
  { text: "Identifiers", link: "/explore/identifiers" },
  { text: "Observers", link: "/explore/observers" },
];

const NavigationButtons: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState<string>("Observations");

  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = SecondBoxItems.find(item => item.link === currentPath);
    if (activeItem) {
      setActiveButton(activeItem.text);
    }
  }, [location.pathname]);

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-around"}
      sx={{ backgroundColor: "grey", height: 70 }}
    >
      <Typography variant="h4">Bharat</Typography>
      <Box display={"flex"} alignItems={"center"} gap={1.5} sx={{ marginLeft: 15 }}>
        {SecondBoxItems.map((item) => (
          <Button
            key={item.text}
            sx={{
              color: "white",
              backgroundColor: activeButton === item.text ? "darkgreen" : "transparent",
              "&:hover": {
                backgroundColor: activeButton === item.text ? "darkgreen" : "rgba(255,255,255,0.1)",
              },
            }}
            onClick={() => {
              setActiveButton(item.text);
              navigate(item.link);
            }}
          >
            {item.text}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default NavigationButtons;