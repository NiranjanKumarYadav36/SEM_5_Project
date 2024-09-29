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
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading && data.length === 0) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Function to handle updates for agreements
  const handleUpdateAgreement = async (userId: string, image: URL, scientificName: string) => {
    try {
      const response = await axiosclient.post("/species_identifications/", {
        user: userId,
        image: image.toString(),
        scientific_name: scientificName,
        option: "yes",
      });
      console.log("Agreement updated:", response.data);

      setData((prevData) =>
        prevData.map((item) =>
          item.user_id === userId && item.scientific_name === scientificName
            ? { ...item, no_identification_agreement: item.no_identification_agreement + 1 }
            : item
        )
      );
      // Optionally update the UI state here

      
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
      } else {
        console.error("Request error:", error.message);
      }
    }
  };

  // Function to handle updates for disagreements
  const handleUpdateDisagreement = async (userId: string, image: URL, scientificName: string) => {
    try {
      const response = await axiosclient.post("/species_identifications/", {
        user: userId,
        image: image.toString(),
        scientific_name: scientificName,
        option: "no",
      });
      console.log("Disagreement updated:", response.data);
      // Optionally update the UI state here
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
      } else {
        console.error("Request error:", error.message);
      }
    }
  };

  return (
    <Box sx={{ maxHeight: "100vh", overflowY: "auto" }}>
      <Navbar />
      <Box sx={{ padding: "20px", margin: 10 }}>
        <Grid container spacing={2} justifyContent="center">
          {paginatedData.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ width: "100%", margin: "10px 0" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image.toString()}
                  alt={item.common_name}
                />
                <CardContent>
                  <Typography variant="h5">{item.common_name}</Typography>
                  <Typography variant="subtitle1">{item.scientific_name}</Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Button
                      variant="contained"
                      onClick={() => handleUpdateAgreement(item.user_id, item.image, item.scientific_name)}
                    >
                      {item.no_identification_agreement} Agree
                    </Button>
                    <Button
                      variant="contained"
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
        <Box sx={{ textAlign: "center", marginTop: "20px" }}>
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
function setData(arg0: (prevData: any) => any) {
  throw new Error("Function not implemented.");
}

