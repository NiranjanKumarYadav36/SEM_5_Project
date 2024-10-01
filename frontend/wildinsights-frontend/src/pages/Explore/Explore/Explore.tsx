/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Navbar from "../../../components/Navbar/Navbar";
import Maps from "../../../components/GoogleMaps/googlemaps";
import NavigationButtons from "../../../components/Explore/NavigationButton/navigationbutton";
import SearchBar from "../../../components/Explore/SearchBar/searchbar";
import Footer from "../../../components/Footer/footer";
import axiosclient from "../../../components/Apiclient/axiosclient";
import LoadingScreen from "../../../components/LoadingScreen/Loading";



interface ObservationData {
  category: string;
  common_name: string;
  image: URL;
  latitude: number;
  longitude: number;
  user_id: string;
}



export default function Explore() {
  const [defaultData, setDefaultData] = useState([]);  // For default observations
  const [filteredData, setFilteredData] = useState([]);  // For search-specific data
  const [loading, setLoading] = useState(true);
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosclient.get("/explore");
        setDefaultData(response.data.data || []); // Set to an empty array if data is null or undefined
      } catch (error) {
        console.error("Failed to load data.",error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const [searchResults, setSearchResults] = useState<ObservationData[]>([]);

  const handleSearch = async (species: string, location: string) => {
    setIsSearchActive(true);
    setLoading(true);

    try {
      // Construct query params dynamically based on input
      const params: { category?: string; location?: string } = {};
      if (species) {
        params.category = species;
      }
      if (location) {
        params.location = location;
      }
      const response = await axiosclient.get("/explore/filter", { params });
      setFilteredData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching filtered data", error);
    }finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }
  const dataToRender = isSearchActive ? filteredData : defaultData;

  return (
    <Box sx={{overflowY:"auto",maxHeight: "100vh"}}>
      <Box>
        <Navbar />
        <SearchBar onSearch={handleSearch} />
        <NavigationButtons />
      </Box>
      <Box sx={{ position:"relative"}}>
        <Maps data={dataToRender}/>
      </Box>
      <Footer />
    </Box>
  );
}
