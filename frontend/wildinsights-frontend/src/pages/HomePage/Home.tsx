import React from "react";
import { Box, Typography } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/footer";

function HomePage() {
  return (
    <Box>
      <Navbar />
      <Typography>Homepage</Typography>
      <Footer/>
    </Box>
  );
}

export default HomePage;
