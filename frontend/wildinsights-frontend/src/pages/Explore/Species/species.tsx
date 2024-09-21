import React from "react";
import { Box } from "@mui/material";
import Navbar from "../../../components/Navbar/Navbar";
//import { useLoaderData } from "react-router-dom";
import NavigationButtons from "../../../components/Explore/NavigationButton/navigationbutton";
import SearchBar from "../../../components/Explore/SearchBar/searchbar";

export default function Species() {
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
    </Box>
  );
}