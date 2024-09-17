/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {Box,Typography } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";

  
function HomePage(){
    return(
        <Box>
            <Navbar/>
            <Typography>Homepage</Typography>
        </Box>
    )
}

export default HomePage
