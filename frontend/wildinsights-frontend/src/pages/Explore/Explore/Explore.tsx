import React from "react";
import { Box } from "@mui/material";
import Navbar from "../../../components/Navbar/Navbar";
import Maps from "../../../components/GoogleMaps/googlemaps";
//import { useLoaderData } from "react-router-dom";
import NavigationButtons from "../../../components/Explore/NavigationButton/navigationbutton";
import SearchBar from "../../../components/Explore/SearchBar/searchbar";
import Footer from "../../../components/Footer/footer";

export default function Explore() {
  //const data = useLoaderData();

  const handleSearch = (species: string, location: string) => {
    console.log("Search with species:", species, "and location:", location);
    // Handle your search logic here
  };

  return (
    <Box>
      <Navbar />
      <SearchBar  onSearch={handleSearch} />
      <NavigationButtons />
      <Box>
        <Maps />
      </Box>
      <Footer/>
    </Box>
  );
}