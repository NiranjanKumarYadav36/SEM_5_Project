import React from "react";
import {Box,Typography } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";

export const fetchEmptyJSON = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1'); // Empty or dummy JSON URL
    if (!response.ok) {
      throw new Error('Failed to load data');
    }
    return response.json();
};
  
function HomePage(){
    return(
        <Box>
            <Navbar/>
            <Typography>Homepage</Typography>
        </Box>
    )
}

export default HomePage
