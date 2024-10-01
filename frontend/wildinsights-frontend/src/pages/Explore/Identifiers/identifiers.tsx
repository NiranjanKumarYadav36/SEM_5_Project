import React, {useRef } from "react";
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
import { useIdentifierData } from "../../../components/Loaders/ExploreLoader/IdentifiersLoader/identifierloader";
import LoadingScreen from "../../../components/LoadingScreen/Loading";

interface IdentifierData {
  username: string;
  identifications: number;
}

export default function Identifiers() {
  // Use the custom hook to get paginated identifier data
  const { data, loading, error, loadPage, hasMore, page } = useIdentifierData();
  const IdentifierListRef = useRef<HTMLDivElement | null>(null);

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

  // Calculate the starting rank for the current page
  const startingRank = (page - 1) * data.length + 1;

  return (
    <Box sx={{overflowY: "auto",maxHeight: "100vh"}}>
      <Navbar />
      <SearchBar onSearch={handleSearch} />
      <NavigationButtons />

      {/* Observer List with Infinite Scrolling */}
      <Box
        ref={IdentifierListRef}
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
                    Identifications
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((identifier: IdentifierData, index: number) => (
                  <TableRow key={index}>
                    <TableCell>#{startingRank + index}</TableCell>
                    <TableCell>{identifier.username || "Unknown User"}</TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {identifier.identifications || 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination Controls */}
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
            <IconButton onClick={handlePreviousPage} disabled={page === 1 || loading} sx={{ color: !hasMore ? "grey.500" : "primary.main" }}>
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