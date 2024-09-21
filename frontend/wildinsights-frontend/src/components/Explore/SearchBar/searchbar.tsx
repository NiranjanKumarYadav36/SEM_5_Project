import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Filter from "../../../components/Filter/filter";

type Option = {
  name: string;
};

interface SearchComponentProps {
  onSearch: (species: string, location: string) => void;
}

const SearchBar: React.FC<SearchComponentProps> = ({ onSearch }) => {
  const [species, setspecies] = useState("");
  const [location, setlocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [speciesOptions, setSpeciesOptions] = useState<Option[]>([]);
  const [locationOptions, setLocationOptions] = useState<Option[]>([]);
  const [error, setError] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleApplyFilters = (filters: any) => {
    console.log("Applied Filters:", filters);
    // Perform your API call to fetch filtered data here
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

  // Fetch species options when user types in the species field
  useEffect(() => {
    if (species.length < 3) return;

    const fetchSpecies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.example.com/species?query=${species}` // Replace with your API endpoint
        );
        setSpeciesOptions(response.data);
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
          `https://api.example.com/locations?query=${location}` // Replace with your API endpoint
        );
        setLocationOptions(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocation();
  }, [location]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!species && !location) {
      setError("No input found");
      return;
    }
    setError("");
    onSearch(species, location);
  };

  return (
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
            <Filter onApply={handleApplyFilters} />
          </Box>
          {error && (
            <Typography color="error" sx={{ marginTop: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
    </Box>
  );
};

export default SearchBar;
