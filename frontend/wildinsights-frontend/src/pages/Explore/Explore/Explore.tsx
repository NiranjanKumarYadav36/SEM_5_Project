/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Box } from "@mui/material";
import Navbar from "../../../components/Navbar/Navbar";
import Maps from "../../../components/GoogleMaps/googlemaps";
import NavigationButtons from "../../../components/Explore/NavigationButton/navigationbutton";
import SearchBar from "../../../components/Explore/SearchBar/searchbar";
import Footer from "../../../components/Footer/footer";

export default function Explore() {
  const handleSearch = (species: string, location: string) => {
    console.log("Search with species:", species, "and location:", location);
    // Handle your search logic here
  };

  return (
    <Box>
      <Box>
        <Navbar />
        <SearchBar onSearch={handleSearch} />
        <NavigationButtons />
      </Box>
      <Box sx={{ position:"relative", height: "600px", width: "100%" }}>
        <Maps />
      </Box>
      <Footer />
    </Box>
  );
}
