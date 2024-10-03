import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import LocationMapPopup from "../../../components/GoogleMaps/GetLocationMap/locationmap";
import MarkerData from "../../../components/GoogleMaps/GetLocationMap/locationmap";
import Navbar from "../../../components/Navbar/Navbar";

const AddObservation: React.FC = () => {
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [locationData, setLocationData] = useState<MarkerData | null>(null);

  // Function to handle opening the popup
  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  // Function to handle closing the popup
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  // Function to handle saving the marker data
  const handleSaveMarkerData = (data: MarkerData) => {
    setLocationData(data);
    console.log("Marker Data Saved:", data); // Log or use the marker data as needed
  };

  return (
    <div>
      <Box>
        <Navbar />
        <Box>
          <Button variant="contained" onClick={handleOpenPopup}>
            Open Location Map
          </Button>

          {/* Location Map Popup */}
          <LocationMapPopup
            open={openPopup}
            onClose={handleClosePopup}
            onSave={handleSaveMarkerData}
          />
        </Box>

        {/* Display saved marker data */}
        {locationData && (
          <div>
            <h3>Saved Marker Data:</h3>
            <p>Latitude: {locationData.latitude}</p>
            <p>Longitude: {locationData.longitude}</p>
            <p>State: {locationData.state}</p>
            <p>Country: {locationData.country}</p>
            <p>Address: {locationData.address}</p>
          </div>
        )}
      </Box>
    </div>
  );
};

export default AddObservation;
