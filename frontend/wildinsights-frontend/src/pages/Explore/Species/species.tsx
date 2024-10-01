/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import Navbar from "../../../components/Navbar/Navbar";
import NavigationButtons from "../../../components/Explore/NavigationButton/navigationbutton";
import SearchBar from "../../../components/Explore/SearchBar/searchbar";
import Footer from "../../../components/Footer/footer";
import { useSpeciesData } from "../../../components/Loaders/ExploreLoader/SpeciesLoader/speciesloader";
import LoadingScreen from "../../../components/LoadingScreen/Loading";
import altImage from "../../../assets/Species/image-not-found.png";

export default function Species() {
  const { data, loading, error, loadPage, page, hasMore } = useSpeciesData();
  const itemsPerPage = 16; // Number of items per page

  const currentData = data.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleNextPage = () => {
    if (hasMore) {
      loadPage(page + 1); // Load the next page if there's more data
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      loadPage(page - 1); // Load the previous page if we're past the first page
    }
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = altImage; // Replace with your fallback image path
  };

  if (loading ) {
    return <LoadingScreen />; // Show loading screen only when no data is loaded yet
  }

  if (error) {
    return <div>{error}</div>; // Display error if loading fails
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        overflowY: "auto", // Allow vertical scrolling in this area
        height: "calc(100vh - 200px)", // Ensure the content takes up space and allows scrolling
      }}
    >
      <Navbar />
      <SearchBar
        onSearch={(species, location) => console.log(species, location)}
      />
      <NavigationButtons />

      {/* Main content area with scroll */}
      <Box
        sx={{
          flexGrow: 1,
          padding: "10px",
          margin: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={{ maxWidth: 1200 }} // Restrict max-width to center the content
        >
          {currentData &&
            currentData.map((item: any, index: number) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card
                  sx={{
                    height: 350,
                    width: 250,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    border: "1px solid #ccc", // Add a border around cards for better separation
                  }}
                >
                  {/* Display Image */}
                  <CardMedia
                    component="img"
                    height="250"
                    image={item.image} 
                    alt={item.common_name}
                    onError={handleImageError}
                  />
                  {/* Display Content */}
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {item.common_name || "Unknown Species"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Count: {item.observations_count || "N/A"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>

      {/* Pagination Controls */}
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Typography
          variant="body1"
          sx={{ cursor: "pointer", color: page > 1 ? "blue" : "grey" }}
          onClick={handlePreviousPage}
        >
          Previous Page
        </Typography>
        <Typography>Page {page}</Typography>
        <Typography
          variant="body1"
          sx={{ cursor: "pointer", color: hasMore ? "blue" : "grey" }}
          onClick={handleNextPage}
        >
          Next Page
        </Typography>
      </Box>

      <Footer />
    </Box>
  );
}
