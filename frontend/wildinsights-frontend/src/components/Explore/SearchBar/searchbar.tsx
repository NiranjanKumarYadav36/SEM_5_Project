/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axiosclient from "../../Apiclient/axiosclient";
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

  // Predefined species and locations for auto-recommendation
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

  const predefinedLocations = [
    { name: "Andaman and Nicobar" },
    { name: "Andhra Pradesh" },
    { name: "Arunachal Pradesh" },
    { name: "Assam" },
    { name: "Bihar" },
    { name: "Chandigarh" },
    { name: "Chhattisgarh" },
    { name: "Dadra and Nagar Haveli" },
    { name: "Daman and Diu" },
    { name: "Delhi" },
    { name: "Goa" },
    { name: "Gujarat" },
    { name: "Haryana" },
    { name: "Himachal Pradesh" },
    { name: "Jammu and Kashmir" },
    { name: "Jharkhand" },
    { name: "Karnataka" },
    { name: "Kerala" },
    { name: "Lakshadweep" },
    { name: "Madhya Pradesh" },
    { name: "Manipur" },
    { name: "Maharashtra"},
    { name: "Meghalaya" },
    { name: "Mizoram" },
    { name: "Nagaland" },
    { name: "NCT of Delhi" },
    { name: "Odisha" },
    { name: "Puducherry" },
    { name: "Punjab" },
    { name: "Rajasthan" },
    { name: "Sikkim" },
    { name: "Tamil Nadu" },
    { name: "Telangana" },
    { name: "Tripura" },
    { name: "Uttar Pradesh" },
    { name: "Uttaranchal" },
    { name: "Uttarakhand" },
    { name: "West Bengal" },
  ];

  // Filter species options based on user input
  useEffect(() => {
    if (species.length < 1) return;

    const filteredSpecies = predefinedSpecies.filter((option) =>
      option.name.toLowerCase().includes(species.toLowerCase())
    );
    setSpeciesOptions(filteredSpecies);
  }, [species]);

  // Filter location options based on user input
  useEffect(() => {
    if (location.length < 1) return;

    const filteredLocations = predefinedLocations.filter((option) =>
      option.name.toLowerCase().includes(location.toLowerCase())
    );
    setLocationOptions(filteredLocations);
  }, [location]);

  // Handle search form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!species && !location) {
      setError("Please select or type a species and/or a location.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // Construct query params dynamically based on input
      const params: { category?: string; state?: string } = {};
      if (species) {
        params.category = species;
      }
      if (location) {
        params.state = location;
      }

      // Perform API request with axiosClient and send the species & location as query params
      const response = await axiosclient.get("/explore/filter", { params });
      onSearch(species, location); // You can trigger onSearch here
    } catch (error) {
      console.error("Error fetching data", error);
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleApplyFilters = (filters: any) => {
    console.log("Applied Filters:", filters);
    // Perform your API call to fetch filtered data here
  };

  return (
    <Box display={"flex"} alignItems={"center"} justifyContent={"space-around"}>
      <Typography variant="h3" sx={{ marginLeft: 5 }}>
        Observations
      </Typography>
      <Box component="form" onSubmit={handleSearch}>
        <Box display={"flex"} alignItems={"center"} gap={1.5}>
          <SearchIcon fontSize="large" sx={{ marginRight: 2 }} />

          {/* Autocomplete for Species */}
          <Autocomplete
            freeSolo
            options={speciesOptions.map((option) => option.name)} // Display filtered species options
            loading={loading}
            onInputChange={(_event, newInputValue) => setspecies(newInputValue)}
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
            options={locationOptions.map((option) => option.name)} // Display filtered location options
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
    </Box>
  );
};

export default SearchBar;