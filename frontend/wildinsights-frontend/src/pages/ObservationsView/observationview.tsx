import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosclient from "../../components/Apiclient/axiosclient";
import LoadingScreen from "../../components/LoadingScreen/Loading";
import Navbar from "../../components/Navbar/Navbar";
import { Box, Card, CardMedia, Dialog, Typography } from "@mui/material";

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
}

const ObservationView = () => {
  const { id } = useParams<{ id: string }>(); // Assuming you're using `id` from the URL params
  const [speciesData, setSpeciesData] = useState<SpeciesDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchSpeciesDetails = async () => {
      const speciesId = Number(id);
      const params = { id: speciesId };
      try {
        const response = await axiosclient.get("/species_details", {
          params, // Sending species_id as a query param
        });
        console.log(response);

        // Check the response data and handle appropriately
        if (response.status === 200) {
          setSpeciesData(response.data.data);
          console.log(speciesData); // Assuming the species data is in `data.data`
        } else {
          setError("Failed to fetch species details.");
        }
      } catch (err) {
        setError("Error fetching species details: " + err.message);
      } finally {
        setLoading(false); // Stop loading after request completes
      }
    };

    fetchSpeciesDetails();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>{error}</div>;
  }
  const handleClickOpen = () => {
    setOpen(true); // Open the modal
  };

  const handleClose = () => {
    setOpen(false); // Close the modal
  };

  return (
    <Box>
      <Navbar />
      <Box display={"flex"} justifyContent={"space-around"}>
        {speciesData ? (
          <Box>
            <Typography variant="h3" margin={5}>
              {speciesData.common_name}({speciesData.scientific_name})
            </Typography>
            <Box margin={5}>
              <Card>
                <CardMedia
                  component="img"
                  height="auto"
                  image={speciesData.image}
                  alt={speciesData.common_name}
                  sx={{
                    maxWidth: "100%", // Ensure it doesn't overflow
                    maxHeight: "400px", // Set a max height for the image
                    objectFit: "contain", // Maintain aspect ratio
                    cursor: "pointer",
                    border: "5px solid #f0f0f0",
                    borderRadius: "8px",
                    padding: "8px",
                    backgroundColor: "#fff",
                  }}
                  onClick={handleClickOpen}
                />
              </Card>
            </Box>
            <Box >
              <Typography variant="h4" margin={2}>Notes</Typography>
              <Box sx={{backgroundColor: "#fff"}}>
                <Typography>{speciesData.description}</Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <div>No species details available.</div>
        )}
      </Box>
      {/* Dialog for image display */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            image={speciesData?.image} // Display image in dialog
            alt={speciesData?.common_name}
            sx={{
              height: "80vh", // Set height for the dialog image
              objectFit: "contain", // Maintain aspect ratio
            }}
          />
        </Box>
      </Dialog>
    </Box>
  );
};

export default ObservationView;
