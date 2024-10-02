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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useIdentifyLoader } from "../../components/Loaders/IdentifyLoader/identifyloader";
import Navbar from "../../components/Navbar/Navbar";
import LoadingScreen from "../../components/LoadingScreen/Loading";
import Footer from "../../components/Footer/footer";
import SearchBarIdentify from "../../components/Identify/SearchBar/searchbar-identify";
import axiosclient from "../../components/Apiclient/axiosclient";

interface IdentifyData {
  id : number;
  image: URL;
  common_name: string;
  scientific_name: string;
  username: string;
  no_identification_agreement: number;
  no_identification_disagreement: number;
}

export const Identify = () => {
  const [isReviewed, setIsReviewed] = useState(false); // State for the reviewed checkbox
  const { data, loading, error, loadMore } = useIdentifyLoader(1, isReviewed); // Pass isReviewed here
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 whenever data changes
  }, [data]);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data && data.length > 0 
    ? data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) 
    : [];

  if (loading && data.length === 0) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleUpdateAgreement = async ( Id: number ) => {
    console.log(Id)
    try {
      // Optimistically update the UI
      const response = await axiosclient.post("/species_identifications/", {
        id:Id,
        option: "yes",
      });
      console.log("Agreement updated:", response.data);
    } catch (error) {
      console.error("Error updating agreement:", error.response ? error.response.data : error.message);
      // If API call fails, you may need to handle the rollback here as needed
    }
  };

  // Function to handle updates for disagreements
  const handleUpdateDisagreement = async ( Id: number) => {
    try {
      // Optimistically update the UI
      const response = await axiosclient.post("/species_identifications/", {
        id: Id,
        option: "no",
      });
      console.log("Disagreement updated:", response.data);
    } catch (error) {
      console.error("Error updating disagreement:", error.response ? error.response.data : error.message);
      // If API call fails, you may need to handle the rollback here as needed
    }
  };


  return (
    <Box sx={{ maxHeight: "100vh", overflowY: "auto" }}>
      <Navbar />
      <SearchBarIdentify onSearch={function (species: string, location: string): void {
        throw new Error("Function not implemented.");
      }} />
      
      <Box sx={{ padding: "20px", margin: 8 }}>
        {/* Reviewed Checkbox */}
        <FormControlLabel
          control={
            <Checkbox
              checked={isReviewed}
              onChange={(e) => {
                setIsReviewed(e.target.checked);
                setCurrentPage(1); // Reset page to 1 when the checkbox is toggled
              }}
              color="primary"
            />
          }
          label="Show Reviewed"
        />

        <Grid container spacing={2} justifyContent="center" alignItems="stretch">
          {paginatedData.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: "flex" }}>
              <Card sx={{ width: "100%", margin: "10px 0", height: "100%", display: "flex", flexDirection: "column" }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={item.image.toString()}
                  alt={item.common_name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5">{item.common_name}</Typography>
                  <Typography variant="subtitle1">Scientific name: {item.scientific_name}</Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", padding: "16px" }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleUpdateAgreement( item.id)}
                    >
                      {item.no_identification_agreement} Agree
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleUpdateDisagreement( item.id)}
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