import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosclient from "../../components/Apiclient/axiosclient";
import LoadingScreen from "../../components/LoadingScreen/Loading";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/footer";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  Typography,
  Grid,
  Paper,
  Divider,
} from "@mui/material";

interface SpeciesDetails {
  common_name: string;
  scientific_name: string;
  category: string;
  city: string;
  created_date: string;
  description: string;
  image: string;
  latitude: number;
  longitude: number;
  location: string;
  no_identification_agreement: number;
  no_identification_disagreement: number;
  observed_date: string;
  state: string;
  time_observed_at: string;
  updated_date: string;
  user: string;
  country: string;
}

const ObservationView = () => {
  const { id } = useParams<{ id: string }>();
  const [speciesData, setSpeciesData] = useState<SpeciesDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchSpeciesDetails = async () => {
      const speciesId = Number(id);
      const params = { id: speciesId };
      try {
        const response = await axiosclient.get("/species_details", { params });

        if (response.status === 200) {
          setSpeciesData(response.data.data);
        } else {
          setError("Failed to fetch species details.");
        }
      } catch (err) {
        setError("Error fetching species details: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpeciesDetails();
  }, [id]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ maxHeight: "100vh", overflowY: "auto" }}>
      <Navbar />
      <Box
        sx={{
          padding: 4,
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          maxHeight: "80vh", // Limit the height
          overflowY: "auto", // Enable vertical scrolling
        }}
      >
        {speciesData ? (
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  image={speciesData.image}
                  alt={speciesData.common_name}
                  sx={{
                    maxHeight: "300px",
                    objectFit: "cover",
                    cursor: "pointer",
                    borderRadius: "4px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  }}
                  onClick={handleClickOpen}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Scientific Name: {speciesData.scientific_name}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    Category: {speciesData.category}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Observed in: {speciesData.city}, {speciesData.state}, {speciesData.country}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={8}>
              <Paper sx={{ padding: 4, backgroundColor: "#f9f9f9", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                <Typography variant="h5" marginBottom={2}>
                  Description
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />
                <Typography>{speciesData.description}</Typography>

                <Typography variant="h5" marginTop={4} marginBottom={2}>
                  Observation Details
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Observed Date:</strong> {speciesData.observed_date}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Observed Time:</strong> {speciesData.time_observed_at}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Created Date:</strong> {speciesData.created_date}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Updated Date:</strong> {speciesData.updated_date}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Latitude:</strong> {speciesData.latitude}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Longitude:</strong> {speciesData.longitude}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>No. of Agreements:</strong> {speciesData.no_identification_agreement}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>No. of Disagreements:</strong> {speciesData.no_identification_disagreement}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Typography>No species details available.</Typography>
        )}

        {/* Dialog for image display */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
          <CardMedia
            component="img"
            image={speciesData?.image}
            alt={speciesData?.common_name}
            sx={{
              height: "50vh",
              objectFit: "cover",
            }}
          />
        </Dialog>
      </Box>
      <Footer />
    </Box>
  );
};

export default ObservationView;
