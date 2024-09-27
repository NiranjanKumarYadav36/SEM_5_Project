/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import Navbar from "../../../components/Navbar/Navbar";
import NavigationButtons from "../../../components/Explore/NavigationButton/navigationbutton";
import SearchBar from "../../../components/Explore/SearchBar/searchbar";
import Footer from "../../../components/Footer/footer";
import { useObserverData } from "../../../components/Loaders/ExploreLoader/ObserversLoader/observerloader"; // Import the custom hook
import LoadingScreen from "../../../components/LoadingScreen/Loading";

interface ObserverData {
  username: string;
  count: number;
}

export default function Observers() {
  // Use the custom hook to get paginated observer data
  const { data, loading, error, loadMore, hasMore } = useObserverData();
  const observerListRef = useRef<HTMLDivElement | null>(null);

  // Handle the search functionality (currently a placeholder)
  const handleSearch = (species: string, location: string) => {
    console.log("Search with species:", species, "and location:", location);
    // Handle your search logic here
  };

  // Infinite scroll handler
  const handleScroll = () => {
    if (
      observerListRef.current &&
      observerListRef.current.scrollTop + observerListRef.current.clientHeight >=
        observerListRef.current.scrollHeight
    ) {
      loadMore(); // Load more observers when scrolled to the bottom
    }
  };

  // Attach and detach the scroll event listener
  useEffect(() => {
    const currentObserverListRef = observerListRef.current;
    if (currentObserverListRef) {
      currentObserverListRef.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (currentObserverListRef) {
        currentObserverListRef.removeEventListener("scroll", handleScroll);
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

      {/* Observer List with Infinite Scrolling */}
      <Box
        ref={observerListRef}
        sx={{ maxHeight: "70vh", overflowY: "auto", padding: "10px" }}
      >
        <List>
          {data.map((observer: ObserverData, index: number) => (
            <ListItem key={index}>
              <ListItemText
                primary={observer.username || "Unknown Observer"}
                secondary={`Count: ${observer.count || 0}`}
              />
            </ListItem>
          ))}
        </List>
        {/* Display loading indicator at the bottom when more data is loading */}
        {loading && (
          <Typography sx={{ textAlign: "center", padding: "10px" }}>
            Loading more observers...
          </Typography>
        )}
      </Box>

      <Footer />
    </Box>
  );
}
