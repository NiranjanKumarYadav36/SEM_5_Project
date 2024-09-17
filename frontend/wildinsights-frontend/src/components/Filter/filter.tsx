/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextFieldVariants,
} from "@mui/material";
import DatePicker from "@mui/lab/DatePicker";
import axios from "axios";
import { JSX } from "react/jsx-runtime";
import FilterAltIcon from '@mui/icons-material/FilterAlt';

interface FilterProps {
  onApply: (filters: any) => void; // A callback function to apply the filters
}

const Filter: React.FC<FilterProps> = ({ onApply }) => {
  const [species, setSpecies] = useState<string | null>(null);
  const [speciesOptions, setSpeciesOptions] = useState<string[]>([]);
  const [location, setLocation] = useState<string | null>(null);
  const [locationOptions, setLocationOptions] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  // Simulated API call to fetch species options
  useEffect(() => {
    const fetchSpeciesOptions = async () => {
      try {
        const response = await axios.get(
          "https://api.inaturalist.org/v1/taxa/autocomplete?q=" + species
        );
        const speciesList = response.data.results.map((s: any) => s.name);
        setSpeciesOptions(speciesList);
      } catch (error) {
        console.error("Error fetching species options:", error);
      }
    };

    if (species) {
      fetchSpeciesOptions();
    }
  }, [species]);

  // Simulated API call to fetch location options
  useEffect(() => {
    const fetchLocationOptions = async () => {
      try {
        const response = await axios.get(
          "https://api.inaturalist.org/v1/places/autocomplete?q=" + location
        );
        const locationList = response.data.results.map(
          (loc: any) => loc.display_name
        );
        setLocationOptions(locationList);
      } catch (error) {
        console.error("Error fetching location options:", error);
      }
    };

    if (location) {
      fetchLocationOptions();
    }
  }, [location]);

  const handleFilterClick = () => {
    setFilterOpen(true);
  };

  const handleFilterClose = () => {
    setFilterOpen(false);
  };

  const handleApplyFilters = () => {
    // Build the filter parameters
    const filters = {
      species: species || "",
      location: location || "",
      startDate: startDate ? startDate.toISOString().split("T")[0] : "",
      endDate: endDate ? endDate.toISOString().split("T")[0] : "",
    };

    // Call the callback function passed as a prop
    onApply(filters);

    setFilterOpen(false); // Close filter dialog after applying
  };

  return (
    <Box>
      {/* Button to open the filter dialog */}
      <Button variant="contained" color="primary" onClick={handleFilterClick}>
        <FilterAltIcon></FilterAltIcon>
        Filter
      </Button>

      {/* Filter Dialog */}
      <Dialog open={filterOpen} onClose={handleFilterClose}>
        <DialogTitle>Filter Observations</DialogTitle>
        <DialogContent>
          {/* Species Autocomplete */}
          <Autocomplete
            id="species"
            options={speciesOptions}
            getOptionLabel={(option) => option}
            value={species}
            onInputChange={(event, newInputValue) => setSpecies(newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Species"
                margin="normal"
                fullWidth
              />
            )}
          />

          {/* Location Autocomplete */}
          <Autocomplete
            id="location"
            options={locationOptions}
            getOptionLabel={(option) => option}
            value={location}
            onInputChange={(event, newInputValue) => setLocation(newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Location"
                margin="normal"
                fullWidth
              />
            )}
          />

          {/* Date Range Pickers */}
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue: React.SetStateAction<Date | null>) => setStartDate(newValue)}
            renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps, "variant">) => (
              <TextField {...params} margin="normal" fullWidth />
            )}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue: React.SetStateAction<Date | null>) => setEndDate(newValue)}
            renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps, "variant">) => (
              <TextField {...params} margin="normal" fullWidth />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFilterClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleApplyFilters}
            color="primary"
            variant="contained"
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Filter;
