import React, { useEffect, useRef } from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
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
  const { data, loading, error, loadMore, hasMore } = useIdentifierData();
  const identifierListRef = useRef<HTMLDivElement | null>(null);

  // Handle the search functionality (currently a placeholder)
  const handleSearch = (species: string, location: string) => {
    console.log("Search with species:", species, "and location:", location);
    // Handle your search logic here
  };

  // Infinite scroll handler
  const handleScroll = () => {
    if (
      identifierListRef.current &&
      identifierListRef.current.scrollTop + identifierListRef.current.clientHeight >=
        identifierListRef.current.scrollHeight - 10 // Added a buffer of 10px to trigger earlier
    ) {
      loadMore(); // Load more identifiers when scrolled to the bottom
    }
  };

  // Attach and detach the scroll event listener
  useEffect(() => {
    const currentIdentifierListRef = identifierListRef.current;
    if (currentIdentifierListRef) {
      currentIdentifierListRef.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (currentIdentifierListRef) {
        currentIdentifierListRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // Show loading screen if the data is still being loaded initially
  if (loading && data.length === 0) {
    return <LoadingScreen />;
  }

  // Show an error message if there's an error
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Box>
      <Navbar />
      <SearchBar onSearch={handleSearch} />
      <NavigationButtons />

      {/* Identifier List with Infinite Scrolling */}
      <Box
        ref={identifierListRef}
        sx={{ maxHeight: "70vh", overflowY: "auto", padding: "10px" }}
      >
        <List>
          {data.map((identifier: IdentifierData, index: number) => (
            <ListItem key={index}>
              <ListItemText
                primary={identifier.username || "Unknown User"}
                secondary={`Identifications: ${identifier.identifications || 0}`}
              />
            </ListItem>
          ))}
        </List>
        {/* Display loading indicator at the bottom when more data is loading */}
        {loading && (
          <Typography sx={{ textAlign: "center", padding: "10px" }}>
            Loading more identifiers...
          </Typography>
        )}
      </Box>

      <Footer />
    </Box>
  );
}
