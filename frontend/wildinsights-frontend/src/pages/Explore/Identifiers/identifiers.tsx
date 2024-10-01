import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import Navbar from "../../../components/Navbar/Navbar";
import NavigationButtons from "../../../components/Explore/NavigationButton/navigationbutton";
import SearchBar from "../../../components/Explore/SearchBar/searchbar";
import Footer from "../../../components/Footer/footer";
import { useIdentifierData } from "../../../components/Loaders/ExploreLoader/IdentifiersLoader/identifierloader";
import LoadingScreen from "../../../components/LoadingScreen/Loading";

interface IdentifierData {
  username: string;
  identifications: number;
}

export default function Identifiers() {
  // Use the custom hook to get paginated identifier data
  const { data, loading, error, loadPage, hasMore, page } = useIdentifierData();

  const handleSearch = (species: string, location: string) => {
    console.log("Search with species:", species, "and location:", location);
    // Handle your search logic here
  };

  // Handle loading the next page
  const handleNextPage = () => {
    if (hasMore) {
      loadPage(page + 1); // Load the next page
    }
  };

  // Handle loading the previous page
  const handlePreviousPage = () => {
    if (page > 1) {
      loadPage(page - 1); // Load the previous page
    }
  };

  // Show loading screen if the data is still being loaded initially
  if (loading && data.length === 0) {
    return <LoadingScreen />;
  }

  // Show an error message if there's an error
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Box sx={{overflowY: "auto",maxHeight: "100vh"}}>
      <Navbar />
      <SearchBar onSearch={handleSearch} />
      <NavigationButtons />

      {/* Identifier List with Pagination */}
      <Box sx={{ padding: "10px", background: "lightgrey" }}>
        <List subheader={<ListSubheader>Settings</ListSubheader>}>
          {data.map((identifier: IdentifierData, index: number) => (
            <ListItem key={index}>
              <ListItemText
                primary={identifier.username || "Unknown User"}
                secondary={`Identifications: ${identifier.identifications || 0}`}
              />
            </ListItem>
          ))}
        </List>

        {/* Pagination Controls */}
        <Box sx={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
          <Button onClick={handlePreviousPage} disabled={page === 1 || loading}>
            Previous
          </Button>
          {loading && <CircularProgress size={24} />}
          <Button onClick={handleNextPage} disabled={!hasMore || loading}>
            Next
          </Button>
        </Box>

        {/* Pagination Status */}
        <Box sx={{ textAlign: "center", marginTop: "10px" }}>
          <Typography>
            Page {page} of 120
          </Typography>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}