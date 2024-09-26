import React from "react";
import { Box } from "@mui/material";
import Navbar from "../../../components/Navbar/Navbar";
//import { useLoaderData } from "react-router-dom";
import NavigationButtons from "../../../components/Explore/NavigationButton/navigationbutton";
import SearchBar from "../../../components/Explore/SearchBar/searchbar";
import Footer from "../../../components/Footer/footer";
import { identifierdata } from "../../../components/Loaders/ExploreLoader/IdentifiersLoader/identifierloader";
import LoadingScreen from "../../../components/LoadingScreen/Loading";

export default function Identifiers() {
  const { data, loading, error} = identifierdata();
  console.log(data);

  const handleSearch = (species: string, location: string) => {
    console.log("Search with species:", species, "and location:", location);
    // Handle your search logic here
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>{error}</div>; // Display error if loading fails
  }

  return (
    <Box>
      <Navbar />
      <SearchBar  onSearch={handleSearch} />
      <NavigationButtons />
      <Footer/>
    </Box>
  );
}