/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import axiosclient from "../../components/Apiclient/axiosclient";
import { useIdentifyLoader } from "../../components/Loaders/IdentifyLoader/identifyloader";
import Navbar from "../../components/Navbar/Navbar";
import LoadingScreen from "../../components/LoadingScreen/Loading";
import Footer from "../../components/Footer/footer";
import SearchBarIdentify from "../../components/Identify/SearchBar/searchbar-identify";

interface IdentifyData {
  image: URL;
  common_name: string;
  scientific_name: string;
  username: string;
  no_identification_agreement: number;
  no_identification_disagreement: number;
  user_id: string;
}

export const Identify = () => {
  const { data, loading, error } = useIdentifyLoader(); // Ensure IdentifyLoader provides all data
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 whenever data changes
  }, [data]);

  // Calculate total pages based on current data length
  const totalPages = Math.ceil(data.length / itemsPerPage);
  // Get paginated data based on current page
  const paginatedData = data && data.length > 0 
  ? data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) 
  : [];

  if (loading && data.length === 0) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const updateIdentificationCount = async (
    userId: string,
    image: URL,
    scientificName: string,
    option: "yes" | "no"
  ) => {
    const isAgreement = option === "yes";
  
    // Optimistically update the UI
    setData((prevData) =>
      prevData.map((item: { user_id: string; scientific_name: string; no_identification_agreement: number; no_identification_disagreement: number; }) =>
        item.user_id === userId && item.scientific_name === scientificName
          ? {
              ...item,
              no_identification_agreement: isAgreement
                ? item.no_identification_agreement + 1
                : item.no_identification_agreement,
              no_identification_disagreement: !isAgreement
                ? item.no_identification_disagreement + 1
                : item.no_identification_disagreement,
            }
          : item
      )
    );
  
    try {
      // Send the update request to the server
      const response = await axiosclient.post("/species_identifications/", {
        user: userId,
        image: image.toString(),
        scientific_name: scientificName,
        option,
      });
      console.log(`${isAgreement ? "Agreement" : "Disagreement"} updated:`, response.data);
    } catch (error) {
      console.error("Error updating identification:", error.response ? error.response.data : error.message);
  
      // Revert the optimistic update if the request fails
      setData((prevData) =>
        prevData.map((item: { user_id: string; scientific_name: string; no_identification_agreement: number; no_identification_disagreement: number; }) =>
          item.user_id === userId && item.scientific_name === scientificName
            ? {
                ...item,
                no_identification_agreement: isAgreement
                  ? item.no_identification_agreement - 1
                  : item.no_identification_agreement,
                no_identification_disagreement: !isAgreement
                  ? item.no_identification_disagreement - 1
                  : item.no_identification_disagreement,
              }
            : item
        )
      );
    }
  };

  // Function to handle updates for agreements
  const handleUpdateAgreement = async (userId: string, image: URL, scientificName: string) => {
    updateIdentificationCount(userId, image, scientificName, "yes");
  };

  // Function to handle updates for disagreements
  const handleUpdateDisagreement = async (userId: string, image: URL, scientificName: string) => {
    updateIdentificationCount(userId, image, scientificName, "no");
  };

  return (
    <Box sx={{ maxHeight: "100vh", overflowY: "auto" }}>
      <Navbar />
      <SearchBarIdentify onSearch={function (species: string, location: string): void {
        throw new Error("Function not implemented.");
      } } />
      <Box sx={{ padding: "20px", margin: 8 }}>
        <Grid container spacing={2} justifyContent="center" alignItems="stretch">
          {paginatedData.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: "flex" }}>
              <Card sx={{ width: "100%", margin: "10px 0", height:"100%",display: "flex", flexDirection: "column" }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={item.image.toString()}
                  alt={item.common_name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5">{item.common_name}</Typography>
                  <Typography variant="subtitle1" >Scientifc name: {item.scientific_name}</Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", padding: "16px" }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleUpdateAgreement(item.user_id, item.image, item.scientific_name)}
                    >
                      {item.no_identification_agreement} Agree
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleUpdateDisagreement(item.user_id, item.image, item.scientific_name)}
                    >
                      {item.no_identification_disagreement} Disagree
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Pagination controls */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: '10px' }}>
          <Button
            variant="contained"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            sx={{ marginRight: "10px" }}
          >
            Previous Page
          </Button>
          <Button
            variant="contained"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next Page
          </Button>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};