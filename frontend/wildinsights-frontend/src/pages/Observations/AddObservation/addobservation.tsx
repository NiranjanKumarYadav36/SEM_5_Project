import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import axiosclient from "../../../components/Apiclient/axiosclient";
import LocationMapPopup from "../../../components/GoogleMaps/GetLocationMap/locationmap";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/footer";
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface MarkerData {
  latitude: number;
  longitude: number;
  state: string;
  country: string;
  address: string;
}

const predefinedSpecies = [
  { name: "Amphibia" },
  { name: "Actinopterygii" },
  { name: "Aves" },
  { name: "Plantae" },
  { name: "Mollusca" },
  { name: "Mammalia" },
  { name: "Protozoa" },
  { name: "Insecta" },
  { name: "Arachnida" },
  { name: "Reptilia" },
];

const AddObservation: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [openPopup, setOpenPopup] = useState<boolean>(false); // For location popup
  const [markerData, setMarkerData] = useState<MarkerData | null>(null); // Selected location data
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message state

  const navigate = useNavigate(); // Initialize useNavigate

  const [formData, setFormData] = useState({
    common_name: "",
    scientific_name: "",
    species_name_guess: "",
    category: "",
    description: "",
    observed_date: "",
    time_observed_at: "",
    location: "",
    state: "",
    country: "",
    latitude: "",
    longitude: "",
  });

  const [errors, setErrors] = useState({
    image: false,
    common_name: false,
    category: false,
    observed_date: false,
    time_observed_at: false,
    location: false,
  });

  // Function to handle image upload and preview
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Set image preview URL
      setErrors({ ...errors, image: false });
    }
  };

  // Handle input change
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name as string]: value as string,
    });
    setErrors({ ...errors, [name as string]: false });
  };

  // Handle opening the location popup
  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  // Handle saving the marker data from popup
  const handleSaveMarkerData = (data: MarkerData) => {
    setMarkerData(data);
    setFormData({
      ...formData,
      location: data.address,
      state: data.state,
      country: data.country,
      latitude: data.latitude.toString(),
      longitude: data.longitude.toString(),
    });
    setErrors({ ...errors, location: false });
  };

  // Validate required fields
  const validateForm = () => {
    const newErrors = {
      image: !image,
      common_name: formData.common_name.trim() === "",
      category: formData.category === "",
      observed_date: formData.observed_date === "",
      time_observed_at: formData.time_observed_at === "",
      location: formData.location === "",
    };

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => !error);
  };

  // Handle submitting the form data
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axiosclient.post("/add_observation", formData);
      console.log("Observation successfully added:", response.data);
      
      setSuccessMessage("Observation added successfully!"); // Set success message
      
      // Navigate to a different page after 2 seconds (e.g., observation list)
      setTimeout(() => {
        navigate("/observation/me"); // Replace with the appropriate path
      }, 2000);
    } catch (error) {
      console.error("Error adding observation:", error);
    }
  };

  return (
    <Box sx={{ overflowY: "auto", maxHeight: "100vh" }}>
      <Navbar />
      <Box>
        <Card sx={{ maxWidth: 600, margin: "auto", padding: 2, marginBottom: 10, marginTop: 10 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Add New Observation
            </Typography>

            {/* Success message */}
            {successMessage && (
              <Typography variant="body1" color="success" sx={{ marginBottom: 2 }}>
                {successMessage}
              </Typography>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <CardMedia
                component="img"
                height="300"
                image={imagePreview}
                alt="Uploaded Image"
                sx={{ marginBottom: 2 }}
              />
            )}

            {/* Image Upload */}
            <Button
              variant="contained"
              component="label"
              sx={{ marginY: 1 }}
              color={errors.image ? "error" : "primary"}
            >
              Upload Image *
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </Button>

            {/* Common Name */}
            <TextField
              label="Common Name *"
              name="common_name"
              value={formData.common_name}
              onChange={handleInputChange}
              error={errors.common_name}
              fullWidth
              sx={{ marginY: 1 }}
              helperText={errors.common_name && "Common name is required"}
            />

            {/* Scientific Name */}
            <TextField
              label="Scientific Name"
              name="scientific_name"
              value={formData.scientific_name}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginY: 1 }}
            />

            {/* Species Name Guess */}
            <TextField
              label="Species Name Guess"
              name="species_name_guess"
              value={formData.species_name_guess}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginY: 1 }}
            />

            {/* Category - Select from predefined options */}
            <FormControl fullWidth sx={{ marginY: 1 }} error={errors.category}>
              <InputLabel id="category-label">Category *</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                label="Category"
              >
                {predefinedSpecies.map((species) => (
                  <MenuItem key={species.name} value={species.name}>
                    {species.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && <Typography color="error">Category is required</Typography>}
            </FormControl>

            {/* Description */}
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
              sx={{ marginY: 1 }}
            />

            {/* Observed Date */}
            <TextField
              label="Observed Date *"
              type="date"
              name="observed_date"
              value={formData.observed_date}
              onChange={handleInputChange}
              error={errors.observed_date}
              fullWidth
              sx={{ marginY: 1 }}
              InputLabelProps={{ shrink: true }}
              helperText={errors.observed_date && "Observed date is required"}
            />

            {/* Time Observed At */}
            <TextField
              label="Time Observed *"
              type="time"
              name="time_observed_at"
              value={formData.time_observed_at}
              onChange={handleInputChange}
              error={errors.time_observed_at}
              fullWidth
              sx={{ marginY: 1 }}
              InputLabelProps={{ shrink: true }}
              helperText={errors.time_observed_at && "Time observed is required"}
            />

            {/* Location Data */}
            <Button
              variant="contained"
              onClick={handleOpenPopup}
              sx={{ marginY: 1 }}
              color={errors.location ? "error" : "primary"}
            >
              Select Location *
            </Button>
            {markerData && (
              <Typography variant="body1" sx={{ marginTop: 2 }}>
                Location: {markerData.address} ({markerData.state}, {markerData.country})
              </Typography>
            )}
            {errors.location && <Typography color="error">Location is required</Typography>}

            {/* Submit Button */}
            <Button variant="contained" onClick={handleSubmit} sx={{ marginTop: 2 }}>
              Submit Observation
            </Button>
          </CardContent>
        </Card>

        {/* Location Map Popup */}
        <LocationMapPopup
          open={openPopup}
          onClose={() => setOpenPopup(false)}
          onSave={handleSaveMarkerData}
        />
      </Box>
      <Footer />
    </Box>
  );
};

export default AddObservation;