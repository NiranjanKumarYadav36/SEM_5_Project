import React, { useEffect, useRef } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
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

export default function Identifiers() {
  // Use the custom hook to get paginated identifier data
  const { data, loading, error, loadPage, hasMore, page } = useObserverData();
  const ObserverListRef = useRef<HTMLDivElement | null>(null);

  const handleSearch = (species: string, location: string) => {
    console.log("Search with species:", species, "and location:", location);
    // Handle your search logic here
  };

  // Infinite scroll handler
  const handleScroll = () => {
    if (
      ObserverListRef.current &&
      ObserverListRef.current.scrollTop + ObserverListRef.current.clientHeight >=
      ObserverListRef.current.scrollHeight
    ) {
      loadPage(); // Load more observers when scrolled to the bottom
    }
  };

  // Attach and detach the scroll event listener
  useEffect(() => {
    const currentObserverListRef = ObserverListRef.current;
    if (currentObserverListRef) {
      currentObserverListRef.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (currentObserverListRef) {
        currentObserverListRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

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

  // Calculate the starting rank for the current page
  const startingRank = (page - 1) * data.length + 1;

  return (
    <Box>
      <Navbar />
      <SearchBar onSearch={handleSearch} />
      <NavigationButtons />

      {/* Observer List with Infinite Scrolling */}
      <Box
        ref={ObserverListRef}
        sx={{ maxHeight: "70vh", overflowY: "auto", padding: "10px" }}
      >

        {/* Identifier Table with Pagination */}
        <Box sx={{ padding: "20px", maxWidth: "80%", margin: "auto" }}>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Rank</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                    Observations
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((observers: ObserverData, index: number) => (
                  <TableRow key={index}>
                    <TableCell>#{startingRank + index}</TableCell>
                    <TableCell>{observers.username || "Unknown User"}</TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {observers.count || 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination Controls */}
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
            <IconButton onClick={handlePreviousPage} disabled={page === 1 || loading} sx={{ color: page === 1 ? "grey.500" : "primary.main" }}>
              <ArrowBack />
            </IconButton>
            <Typography sx={{ margin: "0 20px", fontWeight: "bold", color: "primary.main" }}>
              Page {page}
            </Typography>
            {loading && <CircularProgress size={24} sx={{ margin: "0 20px" }} />}
            <IconButton onClick={handleNextPage} disabled={!hasMore || loading} sx={{ color: !hasMore ? "grey.500" : "primary.main" }}>
              <ArrowForward />
            </IconButton>
          </Box>

          {/* Pagination Status */}
          <Box sx={{ textAlign: "center", marginTop: "10px" }}>
            <Typography variant="caption">
              {`Showing ${(startingRank)} to ${(startingRank + data.length - 1)} identifications`}
            </Typography>
          </Box>
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}
