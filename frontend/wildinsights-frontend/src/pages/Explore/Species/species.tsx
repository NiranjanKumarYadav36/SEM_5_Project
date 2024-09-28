/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Pagination,
  CircularProgress,
} from "@mui/material";
import Navbar from "../../../components/Navbar/Navbar";
import NavigationButtons from "../../../components/Explore/NavigationButton/navigationbutton";
import SearchBar from "../../../components/Explore/SearchBar/searchbar";
import Footer from "../../../components/Footer/footer";
import { useSpeciesData } from "../../../components/Loaders/ExploreLoader/SpeciesLoader/speciesloader";
import LoadingScreen from "../../../components/LoadingScreen/Loading";

export default function Species() {
  const { data, loading, error, loadMore, hasMore } = useSpeciesData();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Number of items per page

  // Handle page change
  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
    loadMore(); // Trigger loading more data when navigating to the next page
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = "/fallback-image.jpg"; // Replace with your fallback image path
  };

  // Paginate data locally for the UI
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data?.slice(indexOfFirstItem, indexOfLastItem);

  if (loading && data.length === 0) {
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
                    image={item.image || "vite.svg"} // Handle missing image
                    alt={item.common_name}
                    onError={handleImageError}
                  />
                  {/* Display Content */}
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {item.common_name || "Unknown Species"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Count: {item.count || "N/A"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>

      {/* Pagination Controls */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={Math.ceil(data.length / itemsPerPage)} // Total number of pages
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Load more data when available */}
      {hasMore && (
        <Box display="flex" justifyContent="center" mt={2}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Typography
              variant="body2"
              onClick={loadMore}
              sx={{ cursor: "pointer", color: "blue" }}
            >
              Load more species...
            </Typography>
          )}
        </Box>
      )}

      <Footer />
    </Box>
  );
}