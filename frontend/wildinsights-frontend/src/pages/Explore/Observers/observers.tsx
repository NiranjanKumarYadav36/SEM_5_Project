/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import Navbar from "../../../components/Navbar/Navbar";
import NavigationButtons from "../../../components/Explore/NavigationButton/navigationbutton";
import SearchBar from "../../../components/Explore/SearchBar/searchbar";
import Footer from "../../../components/Footer/footer";
import { observerdata } from "../../../components/Loaders/ExploreLoader/ObserversLoader/observerloader";
import LoadingScreen from "../../../components/LoadingScreen/Loading";

interface ObserverData {
  username: string;
  count: number;
}

export default function Observers() {
  const { data, loading, error, loadMore } = observerdata();
  const [observers, setObservers] = useState<ObserverData[]>([]);
  const observerListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (data) {
      setObservers(prevObservers => [...prevObservers, ...data]); // Append new data
    }
  }, [data]);

  const handleSearch = (species: string, location: string) => {
    console.log("Search with species:", species, "and location:", location);
    // Handle your search logic here
  };

  const handleScroll = () => {
    if (
      observerListRef.current &&
      observerListRef.current.scrollTop + observerListRef.current.clientHeight >=
        observerListRef.current.scrollHeight
    ) {
      loadMore(); // Load more observers when scrolled to the bottom
    }
  };

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

  if (loading && observers.length === 0) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>{error}</div>; // Display error if loading fails
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
          {observers.map((observer: any, index: number) => (
            <ListItem key={index}>
              <ListItemText
                primary={observer.username || "Unknown Observer"}
                secondary={`Count: ${observer.count || 0}`}
              />
            </ListItem>
          ))}
        </List>
        {loading && <Typography>Loading more observers...</Typography>}
      </Box>

      <Footer />
    </Box>
  );
}
