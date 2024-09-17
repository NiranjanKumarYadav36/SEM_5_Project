import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from '@mui/icons-material/FilterAlt';

// Define a type for the options that will be returned by the API
type Option = {
  name: string;
};

export default function Explore() {
  const [species, setspecies] = useState("");
  const [location, setlocation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [speciesOptions, setSpeciesOptions] = useState<Option[]>([]); // Species options from API
  const [locationOptions, setLocationOptions] = useState<Option[]>([]); // Location recommendation options
  const [filterOpen, setFilterOpen] = useState(false); // State for managing filter popup

  // Open the filter dialog
  const handleFilterClick = () => {
    setFilterOpen(true);
  };

  // Close the filter dialog
  const handleFilterClose = () => {
    setFilterOpen(false);
  };

  // Fetch species options when user types in the species field
  useEffect(() => {
    if (species.length < 3) return; // Fetch only when input length >= 3 characters

    const fetchSpecies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.example.com/species?query=${species}` //Replace with api endpoints
        );
        setSpeciesOptions(response.data); // Assuming API returns an array of species options
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecies();
  }, [species]);

  // Fetch location options when user types in the location field
  useEffect(() => {
    if (location.length < 3) return;

    const fetchLocation = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.example.com/locations?query=${location}` //replace with api endpoints
        );
        setLocationOptions(response.data); // Assuming API returns an array of location options
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocation();
  }, [location]);

  // Handle search form submission
  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Perform search based on selected species and location
    if (!species && !location) {
      setError("No input found");
      return;
    }
    setError("");
    // Make the actual search request or perform any action
    console.log("Search with species:", species, "and location:", location);
  };

  return (
    <Box>
      <Navbar />
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-around"}
      >
        <Typography variant="h3" sx={{ marginLeft: 5 }}>
          Observations
        </Typography>
        <Box component="form" onSubmit={handleSearch}>
          <Box display={"flex"} alignItems={"center"} gap={1.5}>
            <SearchIcon fontSize="large" sx={{ marginRight: 2 }} />

            {/* Autocomplete for Species */}
            <Autocomplete
              freeSolo
              options={speciesOptions.map((option) => option.name)} // Assuming API returns { name: 'speciesName' }
              loading={loading}
              onInputChange={(_event, newInputValue) =>
                setspecies(newInputValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  id="species"
                  label="Species"
                  name="species"
                  autoFocus
                  value={species}
                  sx={{ marginRight: 2, width: 150 }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />

            {/* Autocomplete for Location */}
            <Autocomplete
              freeSolo
              options={locationOptions.map((option) => option.name)} // Assuming API returns { name: 'locationName' }
              loading={loading}
              onInputChange={(_event, newInputValue) =>
                setlocation(newInputValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  id="location"
                  label="Location"
                  name="location"
                  value={location}
                  sx={{ marginRight: 2, width: 150 }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Go"}
            </Button>
          </Box>
          {error && (
            <Typography color="error" sx={{ marginTop: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
        {/* Filter Button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<FilterAltIcon />}
          onClick={handleFilterClick}
          sx={{ padding: "10px 20px"}} // Custom style for the button
        >
          Filter
        </Button>
        {/* Popup Dialog for Filters */}
        <Dialog open={filterOpen} onClose={handleFilterClose}>
          <DialogTitle>Filter Options</DialogTitle>
          <DialogContent>
            {/* Add your filter form fields here */}
            <Typography variant="body1">Choose filter criteria:</Typography>

            {/* Example filter fields */}
            <TextField
              margin="normal"
              id="filterSpecies"
              label="Filter by Species"
              fullWidth
            />
            <TextField
              margin="normal"
              id="filterLocation"
              label="Filter by Location"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFilterClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleFilterClose}
              color="primary"
              variant="contained"
            >
              Apply
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
